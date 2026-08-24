(function () {
  "use strict";

  const PATHS = Object.freeze({
    background: "assets/handdrawn/cup-background-clean-v2.png",
    hero: "assets/handdrawn/taro-hero.png",
    heroHappy: "assets/handdrawn/taro-hero-happy-v3.png",
    heroFall: "assets/handdrawn/taro-hero-fall-v3.png",
    ice: "assets/handdrawn/platform-ice.png",
    pudding: "assets/handdrawn/platform-pudding.png",
    lemon: "assets/handdrawn/platform-lemon.png",
    foam: "assets/handdrawn/platform-foam.png",
    boba: "assets/handdrawn/platform-boba.png"
  });

  const images = {};
  Object.entries(PATHS).forEach(([id, path]) => {
    const image = new Image();
    image.decoding = "async";
    image.src = path;
    images[id] = image;
  });

  const PALETTE = Object.freeze({
    ink: "#684652",
    cream: "#fff2cf",
    tea: "#bf865d",
    taro: "#a975ad",
    ice: "#9dd9dd",
    pudding: "#efb95d",
    lemon: "#f2ce4f",
    foam: "#f8e9ca",
    boba: "#493040"
  });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function ready(image) {
    return image && image.complete && image.naturalWidth > 0;
  }

  function platformType(platform) {
    if (platform.materialType) return platform.materialType;
    if (platform.kind === "boost") return "boba";
    if (platform.kind === "cushion") return "foam";
    if (platform.kind === "drift") return "lemon";
    if (platform.kind === "fragile") return "pudding";
    if (platform.tier === "safe") return "ice";
    if (platform.tier === "medium") return ((platform.shapeSeed >>> 0) & 1) ? "lemon" : "pudding";
    return "boba";
  }

  function drawCover(ctx, image, width, height, scale, offsetX, offsetY) {
    const targetScale = Math.max(width / image.naturalWidth, height / image.naturalHeight) * scale;
    const drawWidth = image.naturalWidth * targetScale;
    const drawHeight = image.naturalHeight * targetScale;
    ctx.drawImage(image, (width - drawWidth) / 2 + offsetX, (height - drawHeight) / 2 + offsetY, drawWidth, drawHeight);
  }

  function drawBackground(ctx, options) {
    const { view, state, air } = options;
    ctx.save();
    if (ready(images.background)) {
      const parallaxX = Math.sin(state.player.x * 0.002) * 4;
      const parallaxY = Math.sin(state.player.y * 0.002) * 5 + air * 8;
      ctx.filter = "saturate(0.94) contrast(0.98)";
      drawCover(ctx, images.background, view.width, view.height, 1.02 + air * 0.022, parallaxX, parallaxY);
      ctx.filter = "none";
    } else {
      const fallback = ctx.createRadialGradient(view.anchorX, view.anchorY, 10, view.anchorX, view.anchorY, view.height * 0.75);
      fallback.addColorStop(0, "#e7bd87");
      fallback.addColorStop(1, "#81545a");
      ctx.fillStyle = fallback;
      ctx.fillRect(0, 0, view.width, view.height);
    }

    const wash = ctx.createRadialGradient(view.anchorX, view.anchorY * 0.92, view.width * 0.08, view.anchorX, view.anchorY, view.height * 0.72);
    wash.addColorStop(0, `rgba(255, 236, 190, ${0.08 + air * 0.04})`);
    wash.addColorStop(0.62, "rgba(174, 107, 76, 0.04)");
    wash.addColorStop(1, "rgba(84, 48, 59, 0.2)");
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, view.width, view.height);

    const zone = window.BounceBalance.zoneFor(state.run.maxLevel);
    const zoneWash = {
      classic: "rgba(255, 245, 210, 0.02)",
      swirl: "rgba(111, 205, 203, 0.11)",
      relay: "rgba(255, 238, 202, 0.1)",
      fizz: "rgba(183, 119, 184, 0.11)"
    }[zone.id];
    ctx.fillStyle = zoneWash;
    ctx.fillRect(0, 0, view.width, view.height);

    if (zone.id !== "classic") {
      ctx.globalAlpha = 0.12;
      ctx.strokeStyle = zone.id === "swirl" ? "#b8f3ee" : zone.id === "relay" ? "#fff0c8" : "#f3c6ed";
      ctx.lineWidth = 3;
      ctx.setLineDash(zone.id === "relay" ? [18, 12] : [7, 13]);
      ctx.beginPath();
      ctx.ellipse(view.anchorX, view.anchorY + 10, view.width * 0.39, view.height * 0.4, zone.id === "swirl" ? air * 0.25 : 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }

    ctx.globalAlpha = 0.16 + air * 0.08;
    ctx.strokeStyle = "#fff1c9";
    ctx.lineWidth = 2;
    for (let ring = 0; ring < 3; ring += 1) {
      ctx.beginPath();
      ctx.ellipse(view.anchorX, view.anchorY + 12, view.width * (0.47 - ring * 0.085), view.height * (0.48 - ring * 0.075), 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function platformSize(type, radius) {
    if (type === "foam") return { width: radius * 2.36, height: radius * 1.67 };
    if (type === "boba") return { width: radius * 2.08, height: radius * 2.08 };
    return { width: radius * 2.14, height: radius * 2.14 };
  }

  function drawFallbackPlatform(ctx, type, screen, radius) {
    const colors = { ice: PALETTE.ice, pudding: PALETTE.pudding, lemon: PALETTE.lemon, foam: PALETTE.foam, boba: PALETTE.boba };
    ctx.fillStyle = colors[type];
    ctx.beginPath();
    if (type === "ice") ctx.roundRect(screen.x - radius, screen.y - radius, radius * 2, radius * 2, radius * 0.28);
    else if (type === "foam") ctx.ellipse(screen.x, screen.y, radius * 1.08, radius * 0.76, 0, 0, Math.PI * 2);
    else ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawPlatformLabel(ctx, platform, type, screen, projection, functionVisual) {
    if (projection.alpha <= 0.2) return;
    const labelScale = clamp(projection.scale, 0.74, 1.08);
    const materialNames = { ice: "冰块", pudding: "布丁", lemon: "柠檬", foam: "奶盖", boba: "爆珠" };
    const functionNames = {
      cushion: "奶盖缓冲",
      boost: "爆珠高跳",
      drift: "柠檬漂移",
      fragile: "布丁易碎",
      phase: functionVisual.solid ? "果冻可踩" : "果冻穿透"
    };
    const detail = functionNames[platform.kind] || `${materialNames[type]}普通`;
    ctx.save();
    ctx.translate(screen.x, screen.y);
    ctx.shadowColor = "rgba(82, 45, 57, 0.28)";
    ctx.shadowBlur = 6 * labelScale;
    ctx.fillStyle = "rgba(255, 249, 226, 0.97)";
    ctx.strokeStyle = "rgba(99, 60, 70, 0.72)";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(-39 * labelScale, -18 * labelScale, 78 * labelScale, 36 * labelScale, 12 * labelScale);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = PALETTE.ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `900 ${15.5 * labelScale}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    ctx.fillText(`+${platform.gain}层`, 0, -6 * labelScale);
    ctx.fillStyle = "rgba(104, 69, 78, 0.9)";
    ctx.font = `800 ${9.5 * labelScale}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    ctx.fillText(detail, 0, 8 * labelScale, 70 * labelScale);
    ctx.restore();
  }

  function drawPlatform(ctx, options) {
    const { platform, projection, screen, radius, ageAlpha, candidate, functionVisual } = options;
    const type = platformType(platform);
    const image = images[type];
    const size = platformSize(type, radius);
    ctx.save();
    ctx.globalAlpha = ageAlpha * projection.alpha * functionVisual.alpha;

    if (candidate) {
      ctx.shadowColor = type === "boba" ? "rgba(210, 153, 201, 0.88)" : "rgba(255, 242, 184, 0.9)";
      ctx.shadowBlur = 12 * projection.scale;
    }

    if (ready(image)) {
      ctx.drawImage(image, screen.x - size.width / 2, screen.y - size.height / 2, size.width, size.height);
    } else {
      drawFallbackPlatform(ctx, type, screen, radius);
    }
    ctx.shadowBlur = 0;

    if (platform.kind === "fragile") {
      ctx.strokeStyle = "rgba(104, 53, 51, 0.68)";
      ctx.lineWidth = Math.max(1, 1.6 * projection.scale);
      ctx.beginPath();
      ctx.moveTo(screen.x - radius * 0.24, screen.y - radius * 0.2);
      ctx.lineTo(screen.x + radius * 0.02, screen.y - radius * 0.02);
      ctx.lineTo(screen.x - radius * 0.08, screen.y + radius * 0.2);
      ctx.lineTo(screen.x + radius * 0.27, screen.y + radius * 0.28);
      ctx.stroke();
    }

    if (candidate) {
      ctx.strokeStyle = "rgba(255, 250, 221, 0.86)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      if (type === "ice") {
        ctx.roundRect(screen.x - radius * 1.04, screen.y - radius * 1.04, radius * 2.08, radius * 2.08, radius * 0.3);
      } else if (type === "foam") {
        ctx.ellipse(screen.x, screen.y, radius * 1.1, radius * 0.78, 0, 0, Math.PI * 2);
      } else {
        ctx.arc(screen.x, screen.y, radius * 1.04, 0, Math.PI * 2);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();

    if (candidate || platform.id === "p0" || platform.visited) {
      drawPlatformLabel(ctx, platform, type, screen, projection, functionVisual);
    }
  }

  function drawPlayer(ctx, options) {
    const { view, state, air, scale, facing, input, inputLength } = options;
    const centerX = view.anchorX;
    const centerY = view.anchorY;
    const impactActive = Number.isFinite(state.player.impactUntil) && state.time < state.player.impactUntil;
    ctx.save();
    ctx.globalAlpha = 0.34 - air * 0.24;
    ctx.fillStyle = "#604555";
    ctx.beginPath();
    ctx.ellipse(centerX + air * 25, centerY + air * 18, 23 * (1 - air * 0.55), 16 * (1 - air * 0.55), 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(facing * 0.045);
    if (impactActive) ctx.scale(1.22, 0.76);
    const drawSize = 72 * scale;
    const expressionImage = state.phase === "FALLING" || impactActive ? images.heroFall : images.heroHappy;
    const heroImage = ready(expressionImage) ? expressionImage : images.hero;
    if (ready(heroImage)) {
      ctx.shadowColor = "rgba(83, 52, 73, 0.22)";
      ctx.shadowBlur = 5;
      ctx.drawImage(heroImage, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
    } else {
      ctx.fillStyle = PALETTE.taro;
      ctx.beginPath();
      ctx.arc(0, 0, drawSize * 0.34, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    if (impactActive) {
      const impactProgress = clamp((state.player.impactUntil - state.time) / 0.1, 0, 1);
      ctx.save();
      ctx.globalAlpha = impactProgress * 0.55;
      ctx.strokeStyle = "rgba(255, 241, 200, 0.9)";
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 17, 42 - impactProgress * 8, 14 - impactProgress * 3, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    if (state.phase === "FALLING" && inputLength > 0.08) {
      const nx = input.x / Math.max(0.001, inputLength);
      const ny = input.y / Math.max(0.001, inputLength);
      ctx.save();
      ctx.strokeStyle = "rgba(255, 242, 205, 0.82)";
      ctx.lineWidth = 2.2;
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      ctx.moveTo(centerX + nx * 26, centerY + ny * 26);
      ctx.lineTo(centerX + nx * 62, centerY + ny * 62);
      ctx.stroke();
      ctx.restore();
    }
  }

  window.BounceTaroTheme = Object.freeze({
    drawBackground,
    drawPlatform,
    drawPlayer,
    platformType,
    palette: PALETTE,
    assets: PATHS
  });
}());
