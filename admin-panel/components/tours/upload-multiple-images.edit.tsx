// @ts-ignore
import React, { useState } from 'react'
import { Label, Box, DropZone, BasePropertyProps, DropZoneProps, DropZoneItem } from 'admin-bro'

const Edit: React.FC<BasePropertyProps> = (props) => {
  const { property, onChange, record } = props
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const handleDropZoneChange: DropZoneProps['onChange'] = (files) => {
    const fileNames = files.map(file => file.name);
    setUploadedFiles(fileNames);
    onChange(property.name, fileNames);
  }

  return (
    <Box marginBottom="xxl">
      <Label>{property.label}</Label>
      <DropZone onChange={handleDropZoneChange} multiple />
      {uploadedFiles.map((fileName, index) => (
        <DropZoneItem key={index} src={`/public/img/tours/${fileName}`} />
      ))}
    </Box>
  )
}

export default Edit
