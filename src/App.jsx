import { useState } from 'react'
import './App.css'

function App() {
  const [cat, setCat] = useState(null);
  const [banList, setBanList] = useState([]);

  const getNewCat = async () => {
  const response = await fetch('https://api.thecatapi.com/v1/images/search?has_breeds=1&limit=1', {
      headers: { 'x-api-key': import.meta.env.VITE_APP_ACCESS_KEY }
    });
    const data = await response.json();
    const item = data[0];
    const breed = item.breeds[0];

    const newCat = {
      image: item.url,
      breed: breed.name,
      origin: breed.origin,
      lifespan: breed.life_span,
      energy_level: breed.energy_level,
      affection_level: breed.affection_level,
      grooming: breed.grooming,
    };

    if (isAllowed(newCat)) {
      setCat(newCat);
    } else {
      getNewCat();
    }
  };

  const isAllowed = (newCat) => {
    const banned = banList.map(item => item.value);
    return !banned.includes(newCat.breed) &&
          !banned.includes(newCat.origin) &&
          !banned.includes(newCat.lifespan) &&
          !banned.includes(newCat.energy_level) &&
          !banned.includes(newCat.affection_level) &&
          !banned.includes(newCat.grooming);
  };

  const toggleBan = (label, value) => {
    const exists = banList.find(item => item.label === label && item.value === value);
    if (exists) {
      setBanList(banList.filter(item => !(item.label === label && item.value === value)));
    } else {
      setBanList([...banList, { label, value }]);
    }
  };

  return (
    <>
    <div className='page'>
      <div className='cat-display'>
        <h1>Veni Vici!</h1>
        <h2>Discover Your Next Dream Cat</h2>
        {cat && (
          <div className='cats-stuff'>
            <img className='cat-image' src={cat.image} height={200}/>
            <div className='cat-info'>
              <p>Breed:  
                <span className='attr-pill' onClick={() => toggleBan('Breed', cat.breed)}>{cat.breed}</span></p>
              <p>Origin: 
                <span className='attr-pill' onClick={() => toggleBan('Origin', cat.origin)}>{cat.origin}</span></p>
              <p>Lifespan:  
                <span className='attr-pill' onClick={() => toggleBan('Lifespan', cat.lifespan)}>{cat.lifespan} years</span></p>
              <p>Energy Level:  
                <span className='attr-pill' onClick={() => toggleBan('Energy Level', cat.energy_level)}>{cat.energy_level}</span></p>
              <p>Affection:  
                <span className='attr-pill' onClick={() => toggleBan('Affection', cat.affection_level)}>{cat.affection_level}</span></p>
              <p>Grooming:  
                <span className='attr-pill' onClick={() => toggleBan('Grooming', cat.grooming)}>{cat.grooming}</span></p>
            </div>
          </div>
        )}
        <button onClick={getNewCat}>
          Find My Cat
        </button>
      </div>
      <div className='banList'>
        <h3>Ban List</h3>
        <ul>
          {banList.map((item) => (
            <li onClick={() => toggleBan(item.label, item.value)} key={item.value}>
              {item.label}: {item.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
    </>
  )
}

export default App
