const path = require('path');
const fs = require('fs');
const AdminBro = require('admin-bro');

/** @type {AdminBro.After<AdminBro.ActionResponse>} */
const after = async (response, request, context) => {
  const { record, uploadCover, uploadImages } = context;

  if (record.isValid() && uploadCover) {
    const fileName = `tour-${record.id().toString()}-cover}.jpg`;
    const filePath = path.join('public/img/tours', fileName);
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.rename(uploadCover.path, filePath);

    await record.update({
      imageCover: `${fileName}`,
    });
  }

  if (record.isValid() && uploadImages) {
    const fileNames = [];
    for (let i = 0; i < uploadImages.length; i++) {
      const fileName = `tour-${record.id().toString()}-${i + 1}}.jpg`;
      const filePath = path.join('public/img/tours', fileName);

      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.rename(uploadImages[i].path, filePath);

      fileNames.push(fileName);
    }

    await record.update({
      images: fileNames,
    });
  }
  return response;
};

/** @type {AdminBro.Before} */
const before = async (request, context) => {
  if (request.method === 'post') {
    const { uploadCover, uploadImages, ...otherParams } = request.payload;

    // eslint-disable-next-line no-param-reassign
    context.uploadCover = uploadCover;
    context.uploadImages = uploadImages;

    return {
      ...request,
      payload: otherParams,
    };
  }
  return request;
};

module.exports = { after, before };
