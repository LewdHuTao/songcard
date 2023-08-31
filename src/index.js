const { createCanvas, loadImage } = require("canvas");
const Jimp = require("jimp");

async function createCard(imageBg, imageText, trackStream, trackDuration) {
  const prettyMilliseconds = (await import("pretty-ms")).default;
  const canvasWidth = 1200;
  const canvasHeight = 400;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  const imageToAdd = await loadImage(imageBg);
  const imageToAdds = await Jimp.read(imageBg);

  const sampleColor = imageToAdds.getPixelColor(0, 0);
  const { r, g, b } = Jimp.intToRGBA(sampleColor);

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, `rgb(${r}, ${g}, ${b})`);
  gradient.addColorStop(1, `rgb(${r}, ${g}, ${b})`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const progressWidth = 700;
  const progressHeight = 8;
  const progressX = 420;
  const progressY = 280;
  const borderRadius1 = 10;

  const progressValue = 1.0;
  const progressColor = "gray";

  ctx.fillStyle = progressColor;
  ctx.roundRect(
    progressX,
    progressY,
    progressWidth * progressValue,
    progressHeight,
    borderRadius1
  );
  ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.font = "30px Arial";
  const text1X = 420;
  const text1Y = 330;
  ctx.fillText(trackStream ? LIVE : "0:00", text1X, text1Y);

  ctx.fillStyle = "#fff";
  ctx.font = "30px Arial";
  const text2X = 1060;
  const text2Y = 330;
  ctx.fillText(
    trackStream
      ? `LIVE`
      : prettyMilliseconds(trackDuration, {
          colonNotation: true,
        }),
    text2X,
    text2Y
  );

  const imageSize = Math.min(canvasHeight - 80, canvasWidth - 80);
  const imageX = 40;
  const imageY = 40;
  const borderRadius = 25;

  ctx.filter = "blur(5px)";
  ctx.drawImage(
    canvas,
    0,
    0,
    canvasWidth,
    canvasHeight,
    0,
    0,
    canvasWidth,
    canvasHeight
  );

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(imageX + borderRadius, imageY);
  ctx.lineTo(imageX + imageSize - borderRadius, imageY);
  ctx.quadraticCurveTo(
    imageX + imageSize,
    imageY,
    imageX + imageSize,
    imageY + borderRadius
  );
  ctx.lineTo(imageX + imageSize, imageY + imageSize - borderRadius);
  ctx.quadraticCurveTo(
    imageX + imageSize,
    imageY + imageSize,
    imageX + imageSize - borderRadius,
    imageY + imageSize
  );
  ctx.lineTo(imageX + borderRadius, imageY + imageSize);
  ctx.quadraticCurveTo(
    imageX,
    imageY + imageSize,
    imageX,
    imageY + imageSize - borderRadius
  );
  ctx.lineTo(imageX, imageY + borderRadius);
  ctx.quadraticCurveTo(imageX, imageY, imageX + borderRadius, imageY);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(imageToAdd, imageX, imageY, imageSize, imageSize);
  ctx.restore();

  const textX = imageX + imageSize + 60;
  const textY = imageY - -60;

  const maxWidth = 540;
  const text = imageText;

  const textWidth = ctx.measureText(text).width;

  if (textWidth > maxWidth) {
    const ellipsisWidth = ctx.measureText("...").width;

    const availableWidth = maxWidth - ellipsisWidth;

    let truncatedText = text;
    while (ctx.measureText(truncatedText).width > availableWidth) {
      truncatedText = truncatedText.slice(0, -1);
    }

    truncatedText += "...";

    ctx.fillStyle = "#fff";
    ctx.font = "40px Arial";
    ctx.fillText(truncatedText, textX, textY);
  } else {
    ctx.fillStyle = "#fff";
    ctx.font = "40px Arial";
    ctx.fillText(text, textX, textY);
  }
  return canvas.toBuffer();
}

module.exports = createCard;