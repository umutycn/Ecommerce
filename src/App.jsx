import { Navbar } from "./components";
import { CartProvider } from "./context";
import { Cart, Home } from "./pages";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./styles";

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2200,
          style: {
            borderRadius: "12px",
            fontWeight: "600",
          },
        }}
      />
    </CartProvider>
  );
}
