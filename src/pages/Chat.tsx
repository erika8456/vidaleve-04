import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard
    navigate('/dashboard', { replace: true });
  }, [navigate]);

  return null;
}