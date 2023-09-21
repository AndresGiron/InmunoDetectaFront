import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import UserContext from '../userContext';
import { useContext } from "react";

export const useExternalApi = () => {
    const {setUser} = useContext(UserContext);
    const navigate = useNavigate();
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
    

    const logIn = async (correo, password,setUser,setShow,setError) => {

        const config = {
            url: `${api}/login/`,
            method: 'POST',
            headers: {},
            data: {
                "email" : correo,
                "password":password
            }
        }

        const data = await makeRequest({config}).then((data)=>{
            if(data.hasOwnProperty("error"))
            {
                setError("Correo y/o contraseña incorrectos")
                setShow(true)
            }else
            {
                console.log(data.user.estado)
                if(!data.user.estado){
                    setError("La cuenta no ha sido activada, hable con un administrador para activarla")
                    setShow(true)
                }else{
                    console.log(data.hasOwnProperty("error"))
                    setUser(data.user)
                    navigate('/ruta-destino');
                }                
            }
        })


    }


    const RegisterPaciente = async (datos,setMensaje,setShow) => {
        console.log(datos)

        const config = {
            url: `${api}/create-paciente/`,
            method: 'POST',
            headers: {},
            data: {
                "cedula" : datos.cedula,
                "nombre":datos.nombre,
                "apellido":datos.apellido,
                "fechaNacimiento":datos.fechaNacimiento,
                "sexo":datos.sexo,
                "correo":datos.correo,
            }
        }

        const data = await makeRequest({config})
        console.log(data)
        if (Object.keys(data).length <= 2)
        {
            if("correo" in data){
                setMensaje("Este correo ya se encuentra registrado")
            }
            if("cedula" in data){
                setMensaje("Esta cedula ya se encuentra registrada")
            }
            setShow(true)
        }else
        {
            RegisterCuentaPaciente(datos).then(()=>{
                loginAfterRegister(datos,setUser)
            })
        }

    }

    const RegisterMedico = async (datos,setMensaje,setShow) => {
        console.log(datos)

        const config = {
            url: `${api}/create-medico/`,
            method: 'POST',
            headers: {},
            data: {
                "cedula" : datos.cedula,
                "nombre":datos.nombre,
                "apellido":datos.apellido,
                "correo":datos.correo,
            }
        }

        const data = await makeRequest({config})
        console.log(data)
        if (Object.keys(data).length <= 2)
        {
            if("correo" in data){
                setMensaje("Este correo ya se encuentra registrado")
            }
            if("cedula" in data){
                setMensaje("Esta cedula ya se encuentra registrada")
            }
            setShow(true)
        }else
        {
            RegisterCuentaMedico(datos)
        }

    }

    const RegisterCuentaMedico = async (datos) => {

        const config = {
            url: `${api}/register/`,
            method: 'POST',
            headers: {},
            data: {
                "email":datos.correo,
                "username":datos.correo,
                "rol":"medico",
                "password":datos.password,
                "estado":false
            }
        }

        const data = await makeRequest({config})

    }


    const RegisterCuentaPaciente = async (datos) => {

        const config = {
            url: `${api}/register/`,
            method: 'POST',
            headers: {},
            data: {
                "email":datos.correo,
                "username":datos.correo,
                "rol":"paciente",
                "password":datos.password
            }
        }

        const data = await makeRequest({config})

    }

    const loginAfterRegister = async (datos,setUser) => {

        const config = {
            url: `${api}/login/`,
            method: 'POST',
            headers: {},
            data: {
                "email" : datos.correo,
                "password": datos.password
            }
        }

        const data = await makeRequest({config}).then((data)=>{
            setUser(data.user)
            navigate('/');
        })
    }

    return {
        logIn,
        RegisterPaciente,
        RegisterMedico,
    }
}