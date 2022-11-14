import { Plugin, registerPlugin } from "enmity/managers/plugins"
import { React, Toasts } from "enmity/metro/common"
import Settings from "./components/Settings"
import manifest from "../manifest.json"
import { get } from "enmity/api/settings"
import { getIDByName } from "enmity/api/assets"

const ReactDevTools: Plugin = {
	...manifest, // Load manifest information into plugin

	onStart() {
		if (get("ReactDevTools", "autoConnect")) { // If auto connect is saved as true
			let host: string = get( // Get saved host and port values
				"ReactDevTools",
				"host"
			) as string, port: string = get(
				"ReactDevTools",
				"port"
			) as string
			if (host == undefined || port == undefined) {
				Toasts.open({
					content: "You have auto connect turned on but haven't set a valid host or port!",
					source: getIDByName("Small")
				})
			} else {
				Toasts.open({ // Notify user of connection attempt
					content: `Connecting to ${host}:${port}`,
					source: getIDByName("check"),
				})
				window.connectToDevTools({ host: `${host}`, port: `${port}` }) // Connect to saved host and port
			}
		}
	},

	onStop() {
		// Something should probably go here but idk what...
	},

	getSettingsPanel({ settings }) {
		return <Settings settings={settings} />
	},
}

registerPlugin(ReactDevTools)
