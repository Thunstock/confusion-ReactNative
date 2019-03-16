import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, Image } from 'react-native';
import { Icon, Input, CheckBox, Button } from 'react-native-elements';
import { SecureStore, Permissions, ImagePicker, Asset, ImageManipulator } from 'expo';
import { createBottomTabNavigator } from 'react-navigation';
import { baseUrl } from '../shared/baseUrl';

class LoginTab extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			remember: false
		};
	}

	componentDidMount() {
		SecureStore.getItemAsync('userinfo').then((userdata) => {
			let userinfo = JSON.parse(userdata);
			if (userinfo) {
				this.setState({ username: userinfo.username });
				this.setState({ password: userinfo.password });
				this.setState({ remember: true });
			}
		});
	}

	static navigationOptions = {
		title: 'Login',
		tabBarIcon: ({ trackColor }) => (
			<Icon name="sign-in" type="font-awesome" size={24} iconStyle={{ color: trackColor }} />
		)
	};

	handleLogin() {
		console.log(JSON.stringify(this.state));
		if (this.state.remember) {
			SecureStore.setItemAsync(
				'userinfo',
				JSON.stringify({ username: this.state.username, password: this.state.password })
			).catch((error) => console.log('Could not save user info', error));
		} else {
			SecureStore.deleteItemAsync('userinfo').catch((error) => console.log('Could not delete user info', error));
		}
	}

	render() {
		return (
			<ScrollView>
				<View style={styles.container}>
					<Input
						placeholder=" Username"
						leftIcon={{ type: 'font-awesome', name: 'user-o', color: '#512DA8' }}
						onChangeText={(username) => this.setState({ username })}
						value={this.state.username}
						containerStyle={styles.formInput}
					/>
					<Input
						placeholder=" Password"
						leftIcon={{ type: 'font-awesome', name: 'key', color: '#512DA8' }}
						onChangeText={(password) => this.setState({ password })}
						value={this.state.password}
						containerStyle={styles.formInput}
					/>
					<CheckBox
						title="Remember Me"
						center
						checked={this.state.remember}
						onPress={() => this.setState({ remember: !this.state.remember })}
						checkedColor="#512DA8"
						containerStyle={styles.formCheckbox}
					/>
					<View style={styles.formButton}>
						<Button
							containerViewStyle={{ alignSelf: 'stretch' }}
							onPress={() => this.handleLogin()}
							title=" Login"
							icon={<Icon name="user-plus" type="font-awesome" color="white" size={24} />}
							buttonStyle={{ backgroundColor: '#512DA8' }}
						/>
					</View>
					<View style={styles.formButton}>
						<Button
							onPress={() => this.props.navigation.navigate('Register')}
							title=" Register"
							type="clear"
							icon={<Icon name="user-plus" type="font-awesome" color="blue" size={24} />}
							titleStyle={{ color: 'blue' }}
						/>
					</View>
				</View>
			</ScrollView>
		);
	}
}

class RegisterTab extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			firstname: '',
			lastname: '',
			email: '',
			remember: false,
			imageUrl: baseUrl + 'images/logo.png'
		};
	}

	processImage = async (imageUri) => {
		let processedImage = await ImageManipulator.manipulateAsync(imageUri, [ { resize: { width: 400 } } ], {
			format: 'png'
		});
		this.setState({ imageUrl: processedImage.uri });
	};

	getImageFromCamera = async () => {
		const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
		const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

		if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
			let capturedImage = await ImagePicker.launchCameraAsync({
				allowsEditing: true,
				aspect: [ 4, 3 ]
			});

			if (!capturedImage.cancelled) {
				this.processImage(capturedImage.uri);
			}
		}
	};

	getImageFromGallery = async () => {
		const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
		const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

		if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
			let capturedImage = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				aspect: [ 4, 3 ]
			});

			if (!capturedImage.cancelled) {
				this.processImage(capturedImage.uri);
			}
		}
	};

	static navigationOptions = {
		title: 'Register',
		tabBarIcon: ({ trackColor }) => (
			<Icon name="user-plus" type="font-awesome" size={24} iconStyle={{ color: trackColor }} />
		)
	};

	handleRegister() {
		console.log(JSON.stringify(this.state));
		if (this.state.remember)
			SecureStore.setItemAsync(
				'userinfo',
				JSON.stringify({ username: this.state.username, password: this.state.password })
			).catch((error) => console.log('Could not save user info', error));
	}

	render() {
		return (
			<ScrollView>
				<View style={styles.container}>
					<View style={styles.imageContainer}>
						<Image
							source={{ uri: this.state.imageUrl }}
							loadingIndicatorSource={require('./images/logo.png')}
							style={styles.image}
						/>
						<Button buttonStyle={styles.cameraButton} title="Camera" onPress={this.getImageFromCamera} />
						<Button buttonStyle={styles.cameraButton} title="Gallery" onPress={this.getImageFromGallery} />
					</View>
					<Input
						placeholder=" Username"
						leftIcon={{ type: 'font-awesome', name: 'user-o', color: '#512DA8' }}
						onChangeText={(username) => this.setState({ username })}
						value={this.state.username}
						containerStyle={styles.formInput}
					/>
					<Input
						placeholder=" Password"
						leftIcon={{ type: 'font-awesome', name: 'key', color: '#512DA8' }}
						onChangeText={(password) => this.setState({ password })}
						value={this.state.password}
						containerStyle={styles.formInput}
					/>
					<Input
						placeholder=" First Name"
						leftIcon={{ type: 'font-awesome', name: 'user-o', color: '#512DA8' }}
						onChangeText={(firstname) => this.setState({ firstname })}
						value={this.state.firstname}
						containerStyle={styles.formInput}
					/>
					<Input
						placeholder=" Last Name"
						leftIcon={{ type: 'font-awesome', name: 'user-o', color: '#512DA8' }}
						onChangeText={(lastname) => this.setState({ lastname })}
						value={this.state.lastname}
						containerStyle={styles.formInput}
					/>
					<Input
						placeholder=" Email"
						leftIcon={{ type: 'font-awesome', name: 'envelope-o', color: '#512DA8' }}
						onChangeText={(email) => this.setState({ email })}
						value={this.state.email}
						containerStyle={styles.formInput}
					/>
					<CheckBox
						title="Remember Me"
						clear
						center
						checked={this.state.remember}
						onPress={() => this.setState({ remember: !this.state.remember })}
						checkedColor="#512DA8"
						containerStyle={styles.formCheckbox}
					/>
					<View style={styles.formButton}>
						<Button
							onPress={() => this.handleRegister()}
							title=" Register"
							icon={<Icon name="user-plus" type="font-awesome" color="white" size={24} />}
							buttonStyle={{ backgroundColor: '#512DA8' }}
						/>
					</View>
				</View>
			</ScrollView>
		);
	}
}

const Login = createBottomTabNavigator(
	{
		Login: LoginTab,
		Register: RegisterTab
	},
	{
		tabBarOptions: {
			activeBackgroundColor: '#9575CD',
			inactiveBackgroundColor: '#D1C4E9',
			activeTintColor: 'white',
			inactiveTintColor: 'gray'
		}
	}
);

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		margin: 20
	},
	imageContainer: {
		flex: 1,
		flexDirection: 'row',
		margin: 20
	},
	image: {
		margin: 10,
		width: 80,
		height: 60
	},
	formInput: {
		margin: 40,
		alignSelf: 'center'
	},
	formCheckbox: {
		backgroundColor: null
	},
	formButton: {
		marginTop: 50,
		marginBottom: 50,
		flex: 1
	},
	cameraButton: {
		backgroundColor: '#512DA8',
		margin: 15
	}
});

export default Login;
