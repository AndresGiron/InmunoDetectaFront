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

    const traerPaciente = async (user,setPaciente) => {
        console.log(user)
        const config = {
            url: `${api}/get-paciente-byemail/`+ user.email,
            method: 'GET',
            headers: {},
            data: {}
        }
        const data = await makeRequest({config})
        console.log(data)
        setPaciente(data)
    }

    const actualizarPaciente = async (user,datos,setPaciente) => {
        console.log(user)
        const config = {
            url: `${api}/paciente/`+user.email+`/update/`,
            method: 'PUT',
            headers: {},
            data: datos
        }
        const data = await makeRequest({config})
        console.log(data)
        setPaciente(data)
    }
    
    const misDiagnosticos = async(paciente,setDiagnosticos) => {
        const config = {
            url: `${api}/get-diagnosticos-bypaciente/`+ paciente.cedula,
            method: 'GET',
            headers: {},
            data: {}
        }
        const data = await makeRequest({config})
        data.map((e)=>{
            if (e.diagnostico_completo["Infeccion asociada a la enfermedad"]===1){
                e.diagnostico_completo["Infeccion asociada a la enfermedad"]="Infección NO asociada"
            }else{
                e.diagnostico_completo["Infeccion asociada a la enfermedad"]="Infección asociada"
            }
            e.medico = e.nombre_medico +" "+ e.apellido_medico
            return 0
        }
        )

        if(Object.keys(data).length === 0 && paciente.cedula !== undefined){
            console.log("entre aqui")
            setDiagnosticos([{"Result":"No hay diagnosticos"}])
            return [{"Result":"No hay diagnosticos"}]
        }

        setDiagnosticos(data)
        console.log(data)
        return data
    }

    return {
        traerPaciente,
        actualizarPaciente,
        misDiagnosticos

    }
}