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

    const traerDoctor = async (user,setDoctor) => {
        console.log(user)
        const config = {
            url: `${api}/get-medico-byemail/`+ user.email,
            method: 'GET',
            headers: {},
            data: {}
        }
        const data = await makeRequest({config})
        console.log(data)
        setDoctor(data)
    }

    const actualizarDoctor = async (user,datos,setDoctor) => {
        console.log(user)
        const config = {
            url: `${api}/medico/`+user.email+`/update/`,
            method: 'PUT',
            headers: {},
            data: datos
        }
        const data = await makeRequest({config})
        console.log(data)
        setDoctor(data)
    }

    const traerDiagnosticos = async (setDiagnosticos) => {
        const config = {
            url: `${api}/get-all-diagnosticos`,
            method: 'GET',
            headers: {},
            data: {}
        }
        const data = await makeRequest({config})
        data.map((e)=>{
            if (e.diagnostico_completo["Infeccion asociada a la enfermedad"]===1){
                e.diagnostico_completo["Infeccion asociada a la enfermedad"]="Infeccion NO asociada"
            }else{
                e.diagnostico_completo["Infeccion asociada a la enfermedad"]="Infeccion asociada"
            }
            e.medico = e.nombre_medico +" "+ e.apellido_medico
            return 0
        }
        )

        if(Object.keys(data).length === 0){
            console.log("entre aqui")
            setDiagnosticos([{"Result":"No hay diagnosticos"}])
            return [{"Result":"No hay diagnosticos"}]
        }

        console.log(data)
        setDiagnosticos(data)
    }

    //

    return {
        traerDoctor,
        actualizarDoctor,
        traerDiagnosticos
    }
}