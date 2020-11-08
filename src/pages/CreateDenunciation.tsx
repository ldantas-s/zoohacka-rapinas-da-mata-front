import React, { FormEvent, useState, ChangeEvent, useEffect } from "react";
import { Map, Marker, TileLayer } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";

// import { useHistory } from "react-router-dom";
// Icons
import { FiPlus, FiSearch } from "react-icons/fi";
// styles
import "../assets/css/pages/create-denunciation.css";
// utils
import MapMarker from "../utils/MapMarker";
//servies
// import api from "../services/api";

export default function CreateDenunciation() {
	// const hisotry = useHistory();
	const [geoLocation, setGeoLocation] = useState({
		latitude: 0,
		longitude: 0,
		zoom: 15,
	});
	const [imagesSelected, setImagesSelected] = useState<File[]>([]);
	const [imagesPreview, setImagesPreview] = useState<string[]>([]);
	const [infoDenunciation, setInfoDenunciation] = useState({
		latitude: 0,
		longitude: 0,
		title: "",
		description: "",
		images: imagesSelected,
		report_time: new Date().getTime(),
		report_day: new Date().getDate(),
	});
	const [stateBarSearch, setStateBarSearch] = useState(false);

	function handleMapClick(event: LeafletMouseEvent) {
		const { lat: latitude, lng: longitude } = event.latlng;

		setInfoDenunciation({ ...infoDenunciation, latitude, longitude });
	}

	function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
		if (!event.target.files) return;

		const images = Array.from(event.target.files);

		setImagesSelected([...imagesSelected, ...images]);

		let imgViews = images.map((image) => {
			return URL.createObjectURL(image);
		});
		setImagesPreview([...imagesPreview, ...imgViews]);
	}

	function handleSubmit(event: FormEvent) {
		event.preventDefault();

		const data = new FormData();

		data.append("name", infoDenunciation.title);
		data.append("about", infoDenunciation.description);
		data.append("latitude", String(infoDenunciation.latitude));
		data.append("longitude", String(infoDenunciation.longitude));

		imagesSelected?.map((image) => {
			data.append("images", image);
		});

		// api
		// 	.post("orphanages", data)
		// 	.then((response) => {
		// 		hisotry.push("/orphanages");
		// 	})
		// 	.catch((err) => console.error("Front-end ERROR:", err));
		console.log(infoDenunciation);
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

	useEffect(() => {
		loadGeoLocation();
	}, []);

	return (
		<div className="pageCreateDenunciation">
			<header className="pageCreateDenunciation-header">
				<h1 className="pageCreateDenunciation-header__title">
					Rapinas da Mata
				</h1>

				<p className="pageCreateDenunciation-header__description">
					Lorem Ipsum é simplesmente uma simulação de texto da indústria
					tipográfica e de impressos, e vem sendo utilizado desde o século XVI,
					quando um impressor desconhecido pegou uma bandeja de tipos e os
					embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum
					sobreviveu não só a cinco séculos, como também ao salto para a
					editoração eletrônica, permanecendo essencialmente inalterado. Se
					popularizou na década de 60, quando a Letraset lançou decalques
					contendo passagens de Lorem Ipsum, e mais recentemente quando passou a
					ser integrado a softwares de editoração eletrônica como Aldus
					PageMaker.
				</p>
			</header>

			<main className="pageCreateDenunciation-main">
				<h2 className="pageCreateDenunciation-main__title">Denúncie:</h2>
				<form
					className="pageCreateDenunciation-main-form"
					onSubmit={handleSubmit}
				>
					<fieldset className="pageCreateDenunciation-main-form__fieldset">
						<legend>Dados</legend>

						<div className="barSearchMap">
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
						</div>
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
								multiple
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

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
