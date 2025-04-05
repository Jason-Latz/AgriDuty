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
      gap: '12px',
      marginLeft: '24px',
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        marginBottom: '8px'
      }}>
        <input
          type="text"
          value={acres}
          onChange={handleChange}
          placeholder="0"
          style={{
            width: '100px',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            fontSize: '16px',
            textAlign: 'right',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            transition: 'all 0.3s ease',
            outline: 'none'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#4a7856';
            e.target.style.boxShadow = '0 0 0 2px rgba(74, 120, 86, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e0e0e0';
            e.target.style.boxShadow = 'none';
          }}
        />
        <span style={{ 
          fontSize: '16px',
          color: '#2c5530',
          fontWeight: '500'
        }}>acres</span>
      </div>
      <button
        onClick={handleAnalyze}
        style={{
          backgroundColor: '#2c5530',
          color: '#ffffff',
          border: 'none',
          borderRadius: '12px',
          padding: '14px 40px',
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          width: '100%',
          maxWidth: '240px',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#4a7856';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#2c5530';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        Analyze
      </button>
    </div>
  );
};

export default AcresInput; 