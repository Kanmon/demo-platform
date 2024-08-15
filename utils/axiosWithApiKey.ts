import axios from 'axios'

export const axiosWithApiKey = (apiKey: string | undefined) =>
  axios.create({
    headers: {
      Authorization: `ApiKey ${apiKey}`,
    },
  })
