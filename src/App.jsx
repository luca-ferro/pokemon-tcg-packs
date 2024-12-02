import React, { useEffect, useState } from 'react';
import Tilty from 'react-tilty';

const App = ({ 
  maxNormalCards = 84 
}) => {
  const [randomImage, setRandomImage] = useState('');
  const [cards, setCards] = useState([]);
  const [showCards, setShowCards] = useState(false);
  const [cardSet, setCardSet] = useState(new Set());
  const [animateTilty, setAnimateTilty] = useState(true);
  const [out, setOut] = useState(false);

  const [fadeIn, setFadeIn] = useState(false)

  const getRandomImage = () => {
    if (cards.length > 0) setOut(true);
    else setOut(false);
  
    if (out) return;
  
    let randomIndex;
    let newImage;
    let folder = "normal_cards";
  
    const folderConfig = {
      normal_cards: { maxCards: maxNormalCards, weight: 60 },
      rare_cards: { maxCards: 55, weight: 33 },
      ex_cards: { maxCards: 11, weight: 5 },
      fullart_cards: { maxCards: 16, weight: 1 },
      fullart_ex_cards: { maxCards: 12, weight: 0.75 },
      gold_rare: { maxCards: 6, weight: 0.25 },
    };
  
    if (cards.length < 4) {
      folder = "normal_cards";
    } else if (cards.length === 4) {
      const totalWeight = Object.values(folderConfig).reduce(
        (sum, { weight }) => sum + weight,
        0
      );
      const randomNum = Math.random() * totalWeight;
  
      let weightSum = 0;
      for (const [key, { weight }] of Object.entries(folderConfig)) {
        weightSum += weight;
        if (randomNum <= weightSum) {
          folder = key;
          break;
        }
      }
    }
  
    const maxCards = folderConfig[folder].maxCards;
  
    do {
      randomIndex = Math.floor(Math.random() * maxCards) + 1;
      newImage = `/assets/${folder}/${randomIndex}.png`;
    } while (cardSet.has(newImage));
  
    setCardSet((prevSet) => new Set(prevSet).add(newImage));
  
    setCards((prevCards) => {
      const updatedCards = [...prevCards, newImage];
      if (updatedCards.length > 5) {
        setOut(true);
        setFadeIn(true);
        setRandomImage('');
        setTimeout(() => setShowCards(true), 500);
      }
      return updatedCards;
    });
  
    setTimeout(() => setOut(false), 500);
    setRandomImage(newImage);
  };

  const handleTryAgain = () => {
    setCards([]);
    setCardSet(new Set());
    setShowCards(false);
    setRandomImage('');
    setAnimateTilty(true);
    getRandomImage();
  };

  useEffect(() => {
    if (animateTilty) {
      setOut(true)
      const timer = setTimeout(() => {setAnimateTilty(false); setOut(false)}, 800);
      return () => clearTimeout(timer);
    }
  }, [animateTilty]);

  useEffect(() => {
    getRandomImage();
  }, []);

  return (
    <div onClick={!showCards || animateTilty ? getRandomImage : undefined} className="App">
      {!showCards && (
        <>
          {fadeIn && (
            <div className='fadeIn'/>
          )}
          <Tilty
            className={`tilty ${animateTilty ? 'tilty-animate' : ''}`}
            axis="x"
            style={{
              backgroundImage: `url(${randomImage})`,
              cursor: out ? '' : 'pointer',
            }}
            glare={cards.length > 5 ? false : true}
            scale={1}
            maxGlare={0.5}
          >
            <div className="inner"></div>
            {out && cards.length > 1 && (
              <img
                src={cards[cards.length - 2]}
                alt={`Última carta: ${cards.length - 1}`}
                className="tilty card-exit"
                style={{
                  visibility: cards.length > 1 ? 'visible' : 'hidden',
                }}
              />
            )}
          </Tilty>
        </>
      )}

      {showCards && (
        <>
          {fadeIn && (
            <div className='fadeOut'/>
          )}
          <div className="end">
            Olha o que saiu!
            <span className="line"></span>
          </div>
          <div
            className="card-images"
            style={{ display: 'flex', gap: '10px' }}
          >
            {cards.slice(0, 5).map((card, index) => (
              <img
                key={index}
                src={card}
                alt={`Card ${index + 1}`}
                style={{ width: '250px', height: 'auto' }}
              />
            ))}
          </div>
          <div className="try-again" onClick={() => {handleTryAgain(); setOut(false); setFadeIn(false)}}>
            Tentar novamente
          </div>
        </>
      )}
    </div>
  );
};

export default App;