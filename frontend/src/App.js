import './App.css';
import React, { createContext, useContext, useState } from "react";
import Select from "react-select";
import PacmanLoader from "react-spinners/PacmanLoader";

const CurrentPlacesContext = createContext(null);
const CurrentSearchServiceContext = createContext(null);

const searchServiceOptions = [
    { value: "openai_chat", label: "OpenAI Chat" },
    { value: "postgres", label: "Postgres Embeddings" }];

export default function App() {
    const [suggestedPlaces, setSuggestedPlaces] = useState([]);
    const [searchServiceOption, setSearchServiceOption] = useState(searchServiceOptions[0]);

    return (
        <body className="App-root">
            <div className="App-main-container">
                <h1 className="App-title">OpenAI Lodging Service</h1>
                <div className="App-content-container">
                    <CurrentSearchServiceContext.Provider value={{ searchServiceOption, setSearchServiceOption }}>
                        <CurrentPlacesContext.Provider value={{ suggestedPlaces, setSuggestedPlaces }}>
                            <PromptForm />
                            <PlacesList />
                        </CurrentPlacesContext.Provider>
                    </CurrentSearchServiceContext.Provider>
                </div>
            </div>
        </body>
    );
}

function PromptForm() {
    const { setSuggestedPlaces } = useContext(CurrentPlacesContext);
    const { searchServiceOption, setSearchServiceOption } = useContext(CurrentSearchServiceContext);
    const [loading, setLoading] = useState(false);

    function searchForPlaces(form) {
        const formData = new FormData(form);
        const prompt = formData.get('userPrompt');

        setLoading(true);

        fetch('/search?engine=' + searchServiceOption.value + '&prompt=' + prompt).
            then((response) => {
                if (!response.ok) {
                    throw new Error(response.status + ' ' + response.statusText);
                } else {
                    response.json().then(function (data) { setSuggestedPlaces(data); });
                }
            }).catch((error) => {
                alert('Oops, something went wrong: ' + error.message);
            }).finally(() => {
                setLoading(false);
            });
    }

    function handleSubmit(event) {
        event.preventDefault();
        searchForPlaces(event.target);
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            searchForPlaces(event.target.form);
        }
    }

    return (
        <form className="App-form" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            <label className="App-form-label" htmlFor="userPrompt">Search for a new place to stay!</label>
            <Select
                options={searchServiceOptions}
                defaultValue={searchServiceOption}
                onChange={setSearchServiceOption}
            />
            <PromptInput />
            <button className="App-form-button" type="submit">Search</button>
            <PacmanLoader color={"#ffffff"} loading={loading} size={25} />
        </form>
    );
}

function PromptInput() {
    return (
        <textarea
            name="userPrompt"
            className="App-form-textarea"
            placeholder="Type in your prompt here"
            autoFocus="true"
        />
    );
}

function PlacesList() {
    const { suggestedPlaces } = useContext(CurrentPlacesContext);

    return (
        <div className="App-places-grid">
            {suggestedPlaces.map((place) => (
                <div className="App-place-card">
                    <div className="App-place-card-name">{place.name}, {place.price}</div>
                    <div className="App-place-card-similarity">Similarity: {place.similarity}</div>
                    <p className="App-place-card-description">{place.description}</p>
                </div>
            ))}
        </div>
    );
}
