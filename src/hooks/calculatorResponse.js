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
    

    const prediccion = async (datos, setResultPredict) => {

        const config = {
            url: `http://127.0.0.1:8000/hacer-predicciones/`,
            method: 'POST',
            headers: {},
            data: datos
        }

        const data = await makeRequest({config})
        setResultPredict(data["Infeccion asociada a la enfermedad"])
        return data

    }

    const traerPacientes = async (setPacientes) => {
        const config = {
            url: `http://127.0.0.1:8000/get-all-pacientes/`,
            method: 'GET',
            headers: {},
            data: {}
        }
        const data = await makeRequest({config})
        const pacientes = data.map(obj => ({
            label: obj.nombre + " " + obj.apellido,
            value: obj.cedula
          }));
        const pacientesO = [{
            label:"Sin paciente asociado",value:-1},...pacientes]
        console.log(pacientesO)
        setPacientes(pacientesO)
    }

    const registrarPrediccion = async (datos,paciente,user) => {
        console.log(datos)
        const cedula_medico = await traermedico(user)
        const config = {
            url: `http://127.0.0.1:8000/create-diagnostico/`,
            method: 'POST',
            headers: {},
            data: {
                "cedula_paciente":paciente,
                "cedula_medico":cedula_medico,
                "diagnostico_completo":datos
              }
        }

        const data = await makeRequest({config})

    }

    const traermedico = async (user) => {
        console.log(user)
        const config = {
            url: `http://127.0.0.1:8000/get-medico-byemail/`+ user.email,
            method: 'GET',
            headers: {},
            data: {}
        }
        const data = await makeRequest({config})
        console.log(data.cedula)
        return data.cedula
    }


    return {
        prediccion,
        traerPacientes,
        registrarPrediccion
    }
}