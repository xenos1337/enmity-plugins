import {
	FormRow,
	FormSwitch,
	FormInput,
	View,
	FormSection,
	FormDivider,
} from "enmity/components"
import { SettingsStore, get } from "enmity/api/settings"
import { React, Toasts } from "enmity/metro/common"
import { getIDByName } from "enmity/api/assets"
declare global { // Globally define the existence of a connectToDevTools function this prevents the need for eval making the plug-in safer
	interface Window {
		connectToDevTools: Function
	}
}

interface SettingsProps { // Create an interface where the users settings can be saved
	settings: SettingsStore
}


export default ({ settings }: SettingsProps) => {
	// Clear settings this is done to reset the states to behave like a first time run to test for bugs (not for production use)
	// settings.set("host", null)
	// settings.set("port", null)
	// settings.set("inputHost", null)
	// settings.set("inputPort", null)
	// settings.set("autoConnect", null)
	return (
		<View>
			<FormSection title="Connection Settings">
				<FormInput
					// Set text box value to whatever is saved as the host or just 192.168. to make typing typical network IP's faster
					value={settings.get("host", "192.168.")}
					title="Host IP Address"
					placeholder="192.168.0.1" // Example of IP address that shows if user removes the default value
					onChange={(input: string) => {
						settings.set("inputHost", input);
						/*
							Moved verification further down to prevent messages being spammed when user was entering last 3 IP numbers. We now store the
							host address the user entered here so if they enter a non IP address then leave the settings page and restart the app it doesn't
							mess up auto connecting by trying to connect to whatever garbage the user typed
						*/
					}}
				/>
				<FormDivider />
				<FormInput
					// TODO: Test if the following sets the port as 8097 for example if its a fresh install and the user doesn't bother changing the port does it ever actually get set to anything or does it just stay null?
					value={settings.get("port", "8097")} // Default IP is 8097 so prefill contents
					title="Host Port"
					placeholder="8097"
					onChange={(input: string) => {
						settings.set("inputPort", input);
						/*
							Moved verification further down to prevent messages being spammed when user was entering last 3 IP numbers. We now store the
							host address the user entered here so if they enter a non IP address then leave the settings page and restart the app it doesn't
							mess up auto connecting by trying to connect to whatever garbage the user typed
						*/
					}}
				/>
				<FormDivider />
				<FormRow
					label="Connect"
					trailing={FormRow.Arrow}
					onPress={() => {
						let inputHost: string = get( // Get the values the user input earlier and set them as invalid by default
							"ReactDevTools",
							"inputHost"
						) as string, inputPort: string = get(
							"ReactDevTools",
							"inputPort"
						) as string,
							valid: boolean = false

						// Verify the IP address is the correct length
						if (inputHost.split(".").length >= 4 && inputPort.length > 0) {
							/*
								Verify the input host IP is in a valid format e.g. 1.1.1.1, 22.22.22.22 or 333.333.333.333 not 4444.4444.4444.4444
								also check the port is 1 to 5 numbers long
							*/
							if (inputHost.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/) && inputPort.match(/^\d{1,5}$/)) {
								settings.set("host", inputHost) // Save host IP and port for auto connect 
								settings.set("port", inputPort)
								valid = true // Set valid as true so connection can be established later
							} else {
								Toasts.open({ // Tell the user the port is invalid with a nice toast
									content: "Invalid IP address or port",
									source: getIDByName("Small"),
								})
							}
						}

						if (valid) {
							// Using inputHost and inputPort here may seem wrong but it's fine since we already know they're valid
							Toasts.open({
								content: `Connecting to ${inputHost}:${inputPort}`,
								source: getIDByName("check"),
							})
							window.connectToDevTools({ host: `${inputHost}`, port: `${inputPort}` })
						}
					}}
				/>
				<FormDivider />
				<FormRow
					label="Auto Connect"
					trailing={
						<FormSwitch
							value={settings.getBoolean("autoConnect", false)}
							onValueChange={(value: boolean) => {
								settings.set("autoConnect", value)
							}}
						/>
					}
				/>
			</FormSection>
			<FormRow label="If establishing a connection with the host fails, please ensure your host IP address and port are correct." />
			<FormRow label="Your host's IP address and port can be found in the React DevTools window." />
		</View>
	)
}
