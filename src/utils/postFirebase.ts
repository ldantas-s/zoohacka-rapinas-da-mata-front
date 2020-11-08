import { url } from "inspector";
import { agFirestore, agStorage, timestamp } from "../firebase/config";

let urlImg: string;

export default function postFirebase(infoDenunciation: any) {
	if (!infoDenunciation.file) return;

	const storageRef = agStorage.ref(infoDenunciation.file.name);
	const collectionRef = agFirestore.collection("denunciations");

	storageRef.put(infoDenunciation.file).on(
		"state_changed",
		(snapshot) => {
			let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log(percentage);
		},
		(err) => {
			console.log(err);
		},
		async () => {
			const url = await storageRef.getDownloadURL();
			collectionRef.add({
				url,
				createdAt: timestamp(),
				title: infoDenunciation.title,
				description: infoDenunciation.description,
				latitude: infoDenunciation.latitude,
				longitude: infoDenunciation.longitude,
			});
			urlImg = url;
		}
	);
	console.log("depois do firebase");

	return urlImg;
}
