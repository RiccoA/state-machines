import React, { useEffect, useReducer} from 'react'

function PokemonFetcher() {
  const [state, dispatch] = useReducer(pokemonReducer, initialState)
  const { error, pokemon, status } = state

  useEffect(() => {
    if (state.status === "loading") {
      let canceled = false
      fetchRandomPokemon()
        .then(data => {
          if(canceled) return
          dispatch({ type: "RESOLVE", data})
        })
        .catch(error => {
          console.log(error)
          if (canceled) return
          dispatch({type: "REJECT", error})
        })
      
        return () => {
          canceled = true
        }
    }

  }, [state.status])

  return (
    <div>
      {error && <span style={{color: "red" }}>{error}</span>}

      <div>
        <button onClick={() => dispatch({type: "FETCH"})}>
          {status === "loading" ? "Fetching..." : "Fetch pokemon!"}
        </button>
      </div>
      <div>
        <button onClick={() => dispatch({type: "CANCEL"})}>Cancel</button>
      </div>

      <div>
        {JSON.stringify(pokemon, null, 2)}
      </div>
    </div>
  )
}

function pokemonReducer(state, event) {
  switch(event.type) {
    case "FETCH" :
      return {
        ...state,
        status: "loading",
        pokemon: null
      }
    case "RESOLVE":
      return {
        ...state,
        status: "success",
        pokemon: event.data
      }
    case "REJECT": 
      return {
        ...state,
        status: "failure",
        error: event.error
      }
    case "CANCEL":
      return {
        ...state,
        status: "idle"
      }
    default:
      return state
  }
}

const initialState = {
  status: "idle",
  pokemon: null,
  error: null
}

function fetchRandomPokemon() {
  return new Promise((res, rej) => {
    setTimeout(() => {
      const fail = Math.random() < 0.1;
      const randomID = Math.floor(Math.random() * (930 - 1 + 1)) + 1;

      if (fail) {
        rej("Failed");
      } else {
        fetch(`https://pokeapi.co/api/v2/pokemon/${randomID}`)
          .then(data => data.json())
          .then(data => {
            res(data);
          });
      }
    }, 1000);
  });
}



export default PokemonFetcher
