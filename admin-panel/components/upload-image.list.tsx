// @ts-ignore
import React from 'react'
import { Box, BasePropertyProps } from 'admin-bro'

const Edit: React.FC<BasePropertyProps> = (props) => {
  const { record } = props

  const srcImg = record.params['photo']
  return (
    <Box>
      {srcImg ? (
        <img src={'/public/img/users/'+srcImg} width="100px" alt={''}/>
      ) : 'no image'}
    </Box>
  )
}

export default Edit
