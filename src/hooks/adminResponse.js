import axios from 'axios'

export const useExternalApi = () => {

    const api = process.env.REACT_APP_BACKEND_URL

    const makeRequest = async (options) => {

        try {
            const response = await axios(options.config)
            const { data } = response

            return data
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data
            }

            return error.message
        }
    }

    const traerUsuarios = async (setUsuarios) => {
        const config = {
            url: `${api}/get-user-medicos`,
            method: 'GET',
            headers: {},
            data: {}
        }
        const data = await makeRequest({config})
        console.log(data)
        setUsuarios(data)
    }

    const cambiarEstado = async (userId) => {
        const config = {
            url: `${api}/cambiar-estado-usuario/`+ userId + "/",
            method: 'PUT',
            headers: {},
            data: {}
        }
        const data = await makeRequest({config})
    }

    return {
        traerUsuarios,
        cambiarEstado
    }
}