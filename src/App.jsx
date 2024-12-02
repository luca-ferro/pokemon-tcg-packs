import React, { useEffect, useState } from 'react';
import Tilty from 'react-tilty';

const App = ({ maxCards = 84 }) => {
  const [randomImage, setRandomImage] = useState('');
  const [cards, setCards] = useState([]);
  const [showCards, setShowCards] = useState(false);
  const [cardSet, setCardSet] = useState(new Set());
  const [animateTilty, setAnimateTilty] = useState(true);
  const [out, setOut] = useState(false);

  const [fadeIn, setFadeIn] = useState(false)

  const getRandomImage = () => {
    if (cards.length > 0)
      setOut(true)
    else
      setOut(false)

    if (out) return;

    let randomIndex;
    let newImage;

    do {
      randomIndex = Math.floor(Math.random() * maxCards) + 1;
      newImage = `/assets/normal_cards/${randomIndex}.png`;
    } while (cardSet.has(newImage));

    setCardSet((prevSet) => new Set(prevSet).add(newImage));

    setCards((prevCards) => {
      const updatedCards = [...prevCards, newImage];
      if (updatedCards.length > 5) {
        setOut(true)
        setFadeIn(true)
        setRandomImage('')
        setTimeout(() => setShowCards(true), 500);
      }
      return updatedCards;
    });

    setTimeout(() => setOut(false), 500)

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
      const timer = setTimeout(() => setAnimateTilty(false), 700);
      return () => clearTimeout(timer);
    }
  }, [animateTilty]);

  useEffect(() => {
    getRandomImage();
  }, []);

  return (
    <div onClick={!showCards ? getRandomImage : undefined} className="App">
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
              cursor: 'pointer',
            }}
            glare={cards.length > 5 ? false : true}
            scale={1}
            maxGlare={0.5}
          >
            <div className="inner"></div>
            {out && (
              <img
                src={cards.length > 0 ? cards[cards.length - 2] : ''}
                alt={cards.length > 0 ? `Última carta: ${cards.length}` : 'Espaço vazio'}
                className="tilty card-exit"
                style={{
                  visibility: cards.length > 0 ? 'visible' : 'hidden',
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