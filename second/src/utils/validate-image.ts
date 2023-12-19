export const checkImageSize = (size): boolean => {
  const fileSizeInMB = Number((size / Math.pow(1024, 2)).toFixed(2));
  return fileSizeInMB < 5;
};

export const checkImageMimetype = (
  imageType,
  types = ['image/jpeg'],
): boolean => {
  return types.includes(imageType);
};
