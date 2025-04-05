import { useState } from 'react';

const AcresInput = () => {
  const [acres, setAcres] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow positive numbers
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAcres(value);
    }
  };

  const handleAnalyze = async () => {
    if (!acres) return;
    
    try {
      // TODO: Implement actual API call
      console.log(`Analyzing ${acres} acres...`);
      // const response = await fetch('YOUR_API_ENDPOINT', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ acres: parseFloat(acres) }),
      // });
      // const data = await response.json();
      // Handle the response data
    } catch (error) {
      console.error('Error analyzing acres:', error);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      marginLeft: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="text"
          value={acres}
          onChange={handleChange}
          placeholder="0"
          style={{
            width: '80px',
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '16px',
            textAlign: 'right'
          }}
        />
        <span style={{ fontSize: '16px' }}>acres</span>
      </div>
      <button
        onClick={handleAnalyze}
        style={{
          backgroundColor: '#000000',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 32px',
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'opacity 0.2s',
          width: '100%',
          maxWidth: '200px'
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
      >
        Analyze
      </button>
    </div>
  );
};

export default AcresInput; 