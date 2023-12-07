const path = require('path');
const fs = require('fs');
const AdminBro = require('admin-bro');

/** @type {AdminBro.After<AdminBro.ActionResponse>} */
const after = async (response, request, context) => {
  const { record, uploadImage } = context;

  if (record.isValid() && uploadImage) {
    const fileName = `user-${record.id().toString()}-${Date.now()}.jpg`;
    const filePath = path.join('public/img/users', fileName);
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.copyFile(uploadImage.path, filePath);
    await fs.promises.unlink(uploadImage.path);
    await record.update({
      photo: `${fileName}`,
    });
  }
  return response;
};

/** @type {AdminBro.Before} */
const before = async (request, context) => {
  if (request.method === 'post') {
    const { uploadImage, ...otherParams } = request.payload;

    // eslint-disable-next-line no-param-reassign
    context.uploadImage = uploadImage;

    return {
      ...request,
      payload: otherParams,
    };
  }
  return request;
};

module.exports = { after, before };
