import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button,  Card } from 'react-bootstrap';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-bg d-flex justify-content-center align-items-center vh-100">
      <Card className="p-5 text-center shadow-lg" style={{ maxWidth: '450px', width: '100%' }}>
        <h1 className="mb-3">Welcome to <span className="text-primary">Task Manager</span></h1>
        <p className="text-muted mb-4">Manage your tasks efficiently and stay productive.</p>
        <div className="d-grid gap-3">
          <Button variant="primary" size="lg" onClick={() => navigate('/login')}>
            <FaSignInAlt className="me-2" />
            Sign In
          </Button>
          <Button variant="success" size="lg" onClick={() => navigate('/register')}>
            <FaUserPlus className="me-2" />
            Sign Up
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Home;
