import { Text, View, StyleSheet, 
		TextInput, Pressable, Button
} from "react-native";
import * as Crypto from 'expo-crypto';
import { useFonts } from "expo-font"; //para utilizar una fuente custom 
import IconRocket from './iconrocket';
import IconCar from './iconcar';
import { Endpoints } from '../constants/Endpoint'; //se pone entre llaves porque es un objeto JavaScript (JSON)
import { Link, router } from "expo-router" //para navegar entre ventanas

import { useContext, useState } from "react";
import { MyContext } from "./Context";
//pancon queso
//https://docs.expo.dev/develop/user-interface/fonts/
//https://reactsvgicons.com/react-svg-icons-guide

export default function Index() {

	const [loaded, error] = useFonts({
		'poppins': require('../assets/fonts/PoppinsSemiBold.ttf'),
	  });

	const [userValue, setUserValue] = useState('');
	const [passValue, setPassValue] = useState('');	
	const [failedLogin, setFailedLogin]=useState(false);
	//Hace que las variables loginData y setLoginData correspondan con las que provee MyContext
	const {loginData, setLoginData} = useContext(MyContext);
	
	const onPassValue = (pass: string) =>
	{
		setPassValue(pass);
	}
	
	const onButtonRegister = async ()=>{
		console.log("register");
		router.replace('/register')
	}

	//BOTÓN DE LOGIN
	const onButtonLogin = async ()=>
	{
		console.log("logging in");
		//hacer la peticion de login
		//console.log('requesting '+Endpoints.LOGIN);
		
		//hashear la contraseña
		//await: función que tarda en regresar, no es síncrona

		const passDigest = await Crypto.digestStringAsync(
			Crypto.CryptoDigestAlgorithm.SHA256, passValue);
		console.log(passDigest);

		const form = new FormData();
		form.append('token','code37');
		form.append('user',userValue);
		form.append('pass',passDigest);
		
		fetch(Endpoints.LOGIN, {
			method: 'POST',
			body:form,
		})
		.then( response => response.json()
		).then( data => {
			if(!data.error && data.id)
			{
				setLoginData(data);
				router.replace('/mainmenu'); //Reemplaza la pantalla principal por mainmenu una vez se logra login
			}
			else
				setFailedLogin(true);
		} )
		.catch(err=>{ console.log(err) });
	}


  return (
    <View style={styles.container}>
		<IconRocket width='100' height='100'></IconRocket>
		<IconCar width='50' height='50'></IconCar> 
		<Text style={styles.title}>ConnectMe</Text>
		<Text >Conecta, Impacta, Destaca</Text>
		<View style={styles.inputfieldlabel}>
			<Text >Usuario</Text>
			<TextInput style={styles.input} onChangeText={setUserValue}></TextInput>
		</View>

		<View style={styles.inputfieldlabel}>
			<Text >Contraseña</Text>
			<TextInput style={styles.input} 
				secureTextEntry={true}
				onChangeText={onPassValue}
			></TextInput>
		</View>

		{failedLogin? (<Text style={styles.error}>Usuario o contraseña incorrectos</Text>):undefined}

		<Pressable style={styles.botonconlogo} onPress={onButtonLogin}>
			<IconCar width='32' height='32'></IconCar>
			<Text>Log In</Text>
		</Pressable>

		<Text >¿No tienes una cuenta?</Text>

		<Pressable style={styles.botonconlogo} onPress={onButtonRegister}>  
			<IconRocket width='32' height='32'></IconRocket>
			<Text>Regístrate.</Text>
		</Pressable>

		<Link href="/mainmenu" asChild>
			<Button title ="main"></Button>
		</Link>
    </View>
	
  );
}


const styles=StyleSheet.create(
	{
		container:{
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
		},
		title:{
			fontFamily:'poppins',
			fontSize:44
		},
		inputfieldlabel:
		{
			flexDirection:'row', //verticalLayout 
			alignItems: 'center',
			justifyContent: 'center',
			width:'60%'
		},
		input: {
			height: 40,
			width:150,
			margin: 12,
			borderWidth: 1,
			padding: 10,
		  },
		botonconlogo:
		{
			backgroundColor:'#F9D689',
			flexDirection:'row',
			alignItems: 'center',
			padding:10,
			borderRadius:5
		},
		error:{
			color: "#F00",
			padding: 5,
		},
		//#973131 #E0A75E #F9D689 #F5E7B2
		
	}
)