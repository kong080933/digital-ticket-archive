import React, { useState, useEffect } from 'react';

export default function App() {
  // 상태 관리
  const [view, setView] = useState('home'); // 'home', 'create', 'archive'
  const [tickets, setTickets] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: '영화',
    date: '',
    place: '',
    seat: '',
    rating: '5',
    review: ''
  });

  // 데이터 불러오기
  useEffect(() => {
    const savedTickets = JSON.parse(localStorage.getItem('myTickets') || '[]');
    setTickets(savedTickets);
  }, []);

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 티켓 저장
  const saveTicket = (e) => {
    e.preventDefault();
    const newTicket = { ...formData, id: Date.now() };
    const updatedTickets = [newTicket, ...tickets];
    setTickets(updatedTickets);
    localStorage.setItem('myTickets', JSON.stringify(updatedTickets));
    alert('티켓이 발행되었습니다!');
    setView('archive');
    // 폼 초기화
    setFormData({ title: '', category: '영화', date: '', place: '', seat: '', rating: '5', review: '' });
  };

  // 티켓 삭제
  const deleteTicket = (id) => {
    if(window.confirm('기록을 삭제할까요?')) {
      const updated = tickets.filter(t => t.id !== id);
      setTickets(updated);
      localStorage.setItem('myTickets', JSON.stringify(updated));
    }
  };

  return (
    <div className="app-layout">
      {/* --- 홈 화면 --- */}
      {view === 'home' && (
        <div className="view-container home-view">
          <div className="hero-section">
            <h1 className="logo">MEMORY<span>TICKET</span></h1>
            <p className="subtitle">당신의 소중한 순간을 디지털 영수증으로 간직하세요.</p>
            <div className="stamp-deco">APPROVED</div>
          </div>
          <div className="menu-buttons">
            <button className="btn-main" onClick={() => setView('create')}>티켓 발행하기</button>
            <button className="btn-sub" onClick={() => setView('archive')}>기록 보관함</button>
          </div>
        </div>
      )}

      {/* --- 티켓 만들기 화면 --- */}
      {view === 'create' && (
        <div className="view-container">
          <div className="nav">
            <button onClick={() => setView('home')}>← BACK</button>
            <h2>ISSUE TICKET</h2>
          </div>
          <form onSubmit={saveTicket} className="create-form">
            <div className="input-group">
              <label>작품명</label>
              <input 
                required 
                type="text" 
                name="title"
                value={formData.title} 
                onChange={handleInputChange} 
                placeholder="공연이나 전시 제목" 
              />
            </div>
            <div className="input-row">
              <div className="input-group">
                <label>카테고리</label>
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  <option>영화</option>
                  <option>뮤지컬</option>
                  <option>공연</option>
                  <option>전시</option>
                </select>
              </div>
              <div className="input-group">
                <label>날짜</label>
                <input 
                  required 
                  type="date" 
                  name="date"
                  value={formData.date} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className="input-group">
              <label>장소</label>
              <input 
                type="text" 
                name="place"
                value={formData.place} 
                onChange={handleInputChange} 
                placeholder="예: 세종문화회관" 
              />
            </div>
            <div className="input-group">
              <label>좌석</label>
              <input 
                type="text" 
                name="seat"
                value={formData.seat} 
                onChange={handleInputChange} 
                placeholder="예: 1층 B열 12번" 
              />
            </div>
            <div className="input-group">
              <label>별점</label>
              <div className="rating-input">
                {[1,2,3,4,5].map(num => (
                  <label key={num} className="radio-label">
                    <input 
                      type="radio" 
                      name="rating" 
                      value={num} 
                      checked={formData.rating == num} 
                      onChange={handleInputChange} 
                    />
                    {num}
                  </label>
                ))}
              </div>
            </div>
            <div className="input-group">
              <label>한 줄 평</label>
              <textarea 
                name="review"
                value={formData.review} 
                onChange={handleInputChange} 
                maxLength="50" 
                placeholder="그날의 감상을 짧게 기록하세요"
              ></textarea>
            </div>
            <button type="submit" className="btn-submit">티켓 생성 및 저장</button>
          </form>
        </div>
      )}

      {/* --- 아카이브 화면 --- */}
      {view === 'archive' && (
        <div className="view-container">
          <div className="nav">
            <button onClick={() => setView('home')}>← BACK</button>
            <h2>ARCHIVE</h2>
          </div>
          <div className="ticket-list">
            {tickets.length === 0 ? (
              <p className="empty-msg">저장된 티켓이 없습니다.</p>
            ) : (
              tickets.map(ticket => (
                <div key={ticket.id} className="ticket-wrapper">
                  <div className="receipt-ticket">
                    <div className="receipt-header">
                      <p className="receipt-type">** {ticket.category} RECEIPT **</p>
                      <p className="receipt-id">NO.{ticket.id.toString().slice(-8)}</p>
                    </div>
                    <div className="receipt-body">
                      <h3 className="ticket-title">{ticket.title}</h3>
                      <div className="receipt-info">
                        <p><span>DATE:</span> {ticket.date}</p>
                        <p><span>PLACE:</span> {ticket.place || 'N/A'}</p>
                        <p><span>SEAT:</span> {ticket.seat || 'FREE'}</p>
                      </div>
                      <div className="receipt-divider"></div>
                      <div className="receipt-review">
                        <p>"{ticket.review || '기록된 감상이 없습니다.'}"</p>
                      </div>
                      <div className="receipt-rating">
                        {'★'.repeat(Number(ticket.rating))}{'☆'.repeat(5-Number(ticket.rating))}
                      </div>
                    </div>
                    <div className="receipt-footer">
                      <div className="barcode"></div>
                      <p>THANK YOU FOR THE MEMORY</p>
                    </div>
                    <div className="analog-stamp">{ticket.category}</div>
                  </div>
                  <button className="btn-delete" onClick={() => deleteTicket(ticket.id)}>삭제</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
