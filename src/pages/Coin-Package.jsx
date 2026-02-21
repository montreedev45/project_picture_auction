import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
const API_URL = import.meta.env.VITE_BACKEND_URL

function CoinPackage() {
  const [coinPacket, SetCoinPacket] = useState([500, 1000, 10000]);
  const token = localStorage.getItem("jwt");
  const userId = localStorage.getItem("acc_id")
  const { fetchUserProfile} = useAuth()

  const fetchCoin = async (coin) => {
    try {
      //const coinPacket = 500
      const payload = { coinPacket: coin };
      await axios.post(
        `${API_URL}/api/auction/coin-packet`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchUserProfile(token, userId);
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    //fetchCoin();
  }, []);

  const handleSubmit = (e) => {
    const { value } = e.target;
    fetchCoin(value);
  };


  const style = {
    color: {color: '#141414ff'},
    coinContainer: {width: 'auto', padding: '20px',margin:'30px', backgroundColor: '#fcfcfc', display: 'flex', justifyContent: 'center',flexWrap: 'wrap',flexDirection: 'row', borderRadius: '20px', marginBottom: '50px', marginTop: "3rem"},
    coinPacket: {textAlign: 'center', border: '3px solid rgb(192, 191, 191)', borderRadius: '20px', padding: '20px', width:'150px', margin: '15px'}
  }
  return (
    <>
      <div className="coin-container" style={style.coinContainer}>
        {coinPacket.map((coin)=> (
        <div className="coin-packet" style={style.coinPacket} key={coin}>
            <h2 style={style.color}>{coin}</h2>
            <button type="submit" className="coin-btn" value={coin} onClick={handleSubmit}>buy</button>
        </div>

        ))}
      </div>
    </>
  );
}

export default CoinPackage;
