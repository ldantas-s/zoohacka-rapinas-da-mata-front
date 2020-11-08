import React, { FormEvent, useState, ChangeEvent, useEffect } from "react";
import { Map, Marker, TileLayer } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";

// Icons
import { FiPlus, FiSearch } from "react-icons/fi";
// styles
import "../assets/css/pages/create-denunciation.css";
// utils
import MapMarker from "../utils/MapMarker";
//servies
// import api from "../services/api";

// import useStorage from "../hooks/useStorage";
import { agFirestore, agStorage, timestamp } from "../firebase/config";
import postFirebase from "../utils/postFirebase";
// import { info } from "console";

export default function CreateDenunciation() {
	// const hisotry = useHistory();
	const [geoLocation, setGeoLocation] = useState({
		latitude: 0,
		longitude: 0,
		zoom: 15,
	});
	const [imagesSelected, setImagesSelected] = useState<File>();
	const [imagesPreview, setImagesPreview] = useState<string[]>([]);
	const [infoDenunciation, setInfoDenunciation] = useState({
		latitude: 0,
		longitude: 0,
		title: "",
		description: "",
		file: imagesSelected,
	});
	const [stateBarSearch, setStateBarSearch] = useState(false);
	const [denunciation, setDenunciation] = useState<boolean>(false);

	// const [formSubmit, setFormSubmit] = useState<boolean>(false);

	function handleMapClick(event: LeafletMouseEvent) {
		const { lat: latitude, lng: longitude } = event.latlng;

		setInfoDenunciation({ ...infoDenunciation, latitude, longitude });
	}

	async function handleSelectImages(event: any) {
		if (!event.target.files) return;

		const image = event.target.files[0];
		setImagesSelected(image);
		console.dir(imagesSelected);
	}

	async function loadGeoLocation() {
		// Desktop GeoLocation
		console.log(navigator);
		if (
			navigator.userAgent.match(/Android/i) ||
			navigator.userAgent.match(/iPhone/i)
		) {
			setGeoLocation({
				latitude: -13.6565472,
				longitude: -69.7260034,
				zoom: 4,
			});
		} else {
			await navigator.geolocation.getCurrentPosition(
				({ coords: { latitude, longitude } }) => {
					setGeoLocation({
						latitude,
						longitude,
						zoom: 15,
					});
				}
			);
		}
	}

	// post no firebase
	const [urlImg, setUrlImg] = useState();
	const [progress, setProgress] = useState(0);

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();

		if (imagesSelected) {
			const storageRef = await agStorage.ref(imagesSelected.name);
			const collectionRef = agFirestore.collection("denunciations");

			storageRef.put(imagesSelected).on(
				"state_changed",
				(snapshot) => {
					let percentage =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					setProgress(percentage);
				},
				(err) => {
					console.log(err);
				},
				async () => {
					const url = await storageRef.getDownloadURL();

					collectionRef.add({
						url: url,
						createdAt: timestamp(),
						title: infoDenunciation.title,
						description: infoDenunciation.description,
						latitude: infoDenunciation.latitude,
						longitude: infoDenunciation.longitude,
					});
				}
			);

			console.log("DEU ERRADO");
		}
	}

	useEffect(() => {
		loadGeoLocation();
	}, []);

	useEffect(() => {
		if (progress === 100) {
			setInfoDenunciation({
				latitude: 0,
				longitude: 0,
				title: "",
				description: "",
				file: imagesSelected,
			});
			setImagesPreview([]);
			setImagesSelected(undefined);
		}
	}, [progress]);

	return (
		<div className="pageCreateDenunciation">
			<header className="pageCreateDenunciation-header">
				<h1 className="pageCreateDenunciation-header__title">
					Rapinas da Mata
				</h1>

				<p className="pageCreateDenunciation-header__description">
					O comércio de animais silvestres no Brasil infelizmente é uma
					realidade que ainda ocorre e as ações de fiscalização e combate aos
					crimes contra a fauna são cada vez mais necessárias. Ao comprar um
					animal silvestre, além da retirada do animal de seu ambiente natural,
					há a privação do direito de viver na natureza juntamente com seus
					semelhantes, diminuição de tempo de vida, uma vez que são submetidos a
					situações estressantes como calor, aglomeração com outros animais,
					limitação para expressar seu comportamento natural, etc. Pensando em
					toda essa situação a equipe Rapinas da Mata, participante do
					ZooHackatoon 2020 criou, além de um sistema blockchain para o combate
					a falsificação de documentos, um canal de denúncia no qual você pode
					realizar anonimamente uma denúncia e auxiliar a causa animal. Vale
					lembrar que a nossa fauna é a casa de todos nós! E aí? bora ajudar
					essa causa?
				</p>
			</header>

			<main className="pageCreateDenunciation-main">
				<h2 className="pageCreateDenunciation-main__title">Denúncie:</h2>
				{denunciation && (
					<h2 className="pageCreateDenunciation-main__title">
						Denúncia feita com sucesso
					</h2>
				)}
				<form
					className="pageCreateDenunciation-main-form"
					onSubmit={handleSubmit}
				>
					<fieldset className="pageCreateDenunciation-main-form__fieldset">
						<legend>Dados</legend>

						{/* <div className="barSearchMap">
							{stateBarSearch && (
								<input
									className="barSearchMap__input"
									type="text"
									autoFocus={stateBarSearch}
									onBlur={() => setStateBarSearch(false)}
								/>
							)}
							<FiSearch
								className="barSearchMap__icon"
								size={34}
								stroke="black"
								onClick={() => setStateBarSearch(true)}
							/>
						</div> */}
						<div className="barSearchMap">Clique para selecionar o local</div>

						<Map
							center={[geoLocation.latitude, geoLocation.longitude]}
							style={{ width: "100%", height: 280, zIndex: 4 }}
							zoom={geoLocation.zoom}
							onClick={handleMapClick}
						>
							<TileLayer
								// url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
								url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
							/>
							{infoDenunciation.latitude !== 0 && (
								<Marker
									interactive={false}
									icon={MapMarker}
									position={[
										infoDenunciation.latitude,
										infoDenunciation.longitude,
									]}
								/>
							)}
						</Map>

						<div className="pageCreateDenunciation-main-form-groupInput">
							<label htmlFor="title">Qual é sua denúncia?</label>
							<input
								required
								id="title"
								name="title"
								value={infoDenunciation.title}
								onChange={(e) =>
									setInfoDenunciation({
										...infoDenunciation,
										title: e.target.value,
									})
								}
							/>
						</div>

						<div className="pageCreateDenunciation-main-form-groupInput">
							<label htmlFor="description">
								Nos conte mais detalhes:
								<br />
								<span>
									Máximo de {300 - infoDenunciation.description.length}{" "}
									caracteres
								</span>
							</label>
							<textarea
								required
								id="description"
								name="description"
								value={infoDenunciation.description}
								onChange={(e) =>
									setInfoDenunciation({
										...infoDenunciation,
										description: e.target.value,
									})
								}
								maxLength={300}
							/>
						</div>

						<div className="pageCreateDenunciation-main-form-groupInput">
							<label htmlFor="images">Nos mostre o que você viu:</label>

							<div className="pageCreateDenunciation-main-form-groupInput-uploadedImg">
								<label
									htmlFor="upImg"
									className="pageCreateDenunciation-main-form-groupInput__newImg"
								>
									<FiPlus size={24} stroke="#26a69a" />
								</label>
								{imagesPreview.map((path, index) => {
									return (
										<button
											key={index}
											type="button"
											className="pageCreateDenunciation-main-form-groupInput-uploadedImg__img"
										>
											<img src={path} alt="Hello" />
										</button>
									);
								})}
							</div>

							<input
								onChange={handleSelectImages}
								className="pageCreateDenunciation-main-form-groupInput__inputImg"
								type="file"
								name="images"
								id="upImg"
							/>
						</div>
					</fieldset>

					<button
						className="pageCreateDenunciation-main-form__btnConfirm"
						type="submit"
					>
						Denunciar
					</button>
				</form>
			</main>
		</div>
	);
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`
