import axios from 'axios'

export const useExternalApi = () => {

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
            url: `http://127.0.0.1:8000/get-user-medicos`,
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
            url: `http://127.0.0.1:8000/cambiar-estado-usuario/`+ userId + "/",
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