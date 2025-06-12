import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import ChatbotPopup from "./Chatbot";
import Button from "./Button";

const generateTimeSlots = () => {
  const times = [];
  for (let h = 8; h <= 16; h++) {
    times.push(`${h.toString().padStart(2, "0")}:00`);
    times.push(`${h.toString().padStart(2, "0")}:30`);
  }
  return times;
};

export default function BookingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    message: "",
  });

  const [appointments, setAppointments] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  // Generiere Zeit-Slots von 08:00 bis 17:30
  const timeSlots = generateTimeSlots();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("appointments").select("*");
      if (data) {
        setAppointments(JSON.stringify(data) === "[]" ? [] : data);
      }
      if (error) {
        console.error("Fehler beim Laden der Termine:", error);
        setAppointments([]);
      }
    };
    fetchData();
  }, []);

  // Validation: Datum + Uhrzeit + Doppelbuchung + Wochenende + Zeitbereich 08:00-17:00
  useEffect(() => {
    setError("");

    if (!formData.date) {
      setIsValid(false);
      return;
    }
    const selectedDate = new Date(formData.date);
    const day = selectedDate.getDay();
    if (day === 0 || day === 6) {
      setError(
        "Termine können npm install @supabase/supabase-jsnur an Wochentagen gebucht werden."
      );
      setIsValid(false);
      return;
    }
    if (!formData.time) {
      setIsValid(false);
      return;
    }

    // Uhrzeit prüfen
    const [hour, minute] = formData.time.split(":").map(Number);
    if (
      isNaN(hour) ||
      isNaN(minute) ||
      hour < 8 ||
      (hour === 17 && minute > 0) ||
      hour > 17
    ) {
      setError("Uhrzeit muss zwischen 08:00 und 17:00 liegen.");
      setIsValid(false);
      return;
    }

    // Doppelbuchung prüfen
    const normalizedTime =
      formData.time.length === 5 ? formData.time + ":00" : formData.time;

    const alreadyBooked = appointments.some(
      (a) => a.date === formData.date && a.time === normalizedTime
    );

    if (alreadyBooked) {
      setError("Dieser Termin ist bereits vergeben.");
      setIsValid(false);
      return;
    }

    setError("");
    setIsValid(true);
  }, [formData.date, formData.time, appointments]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Datum ändern: Wochenende blockieren durch zurücksetzen (keine alert)
  const handleDateChange = (e) => {
    const value = e.target.value;
    if (!value) {
      setFormData((prev) => ({ ...prev, date: "", time: "" }));
      return;
    }
    const day = new Date(value).getDay();
    if (day === 0 || day === 6) {
      setFormData((prev) => ({ ...prev, date: "", time: "" }));
      return;
    }
    setFormData((prev) => ({ ...prev, date: value, time: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    const newAppointment = {
      ...formData,
      id: Date.now(),
    };

    await supabase.from("appointments").insert([newAppointment]);

    setAppointments((prev) => [...prev, newAppointment]);
    setLastName(formData.name);
    setFormData({
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      message: "",
    });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  // Filtere für ausgewähltes Datum bereits gebuchte Zeiten raus (für Dropdown)
  const availableTimes = formData.date
    ? timeSlots.filter(
        (time) =>
          !appointments.some((a) => a.date === formData.date && a.time === time)
      )
    : [];

  return (
    <div className="container">
      <h1>Termin buchen</h1>

      <form onSubmit={handleSubmit} className="appointment-form">
        <label>
          Name
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Max Mustermann"
            autoComplete="off"
          />
        </label>

        <label>
          E-Mail
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="max@example.com"
            autoComplete="off"
          />
        </label>

        <label>
          Telefon
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="+49 123 4567890"
            autoComplete="off"
          />
        </label>

        <div className="row">
          <label>
            Datum
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleDateChange}
              min={new Date().toISOString().split("T")[0]}
            />
          </label>

          <label>
            Uhrzeit
            <select
              name="time"
              required
              value={formData.time}
              onChange={handleChange}
              disabled={!formData.date || availableTimes.length === 0}
            >
              <option value="">-- Uhrzeit wählen --</option>
              {availableTimes.length === 0 && formData.date && (
                <option disabled>Keine Zeiten verfügbar</option>
              )}
              {availableTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Nachricht (optional)
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Hier kannst du eine Nachricht hinterlassen..."
          />
        </label>

        <Button type="submit" disabled={!isValid}>
          Termin buchen
        </Button>

        {error && <p className="error-message">{error}</p>}
      </form>

      {submitted && (
        <div className="success-message">
          Danke, <strong>{lastName}</strong>! Dein Termin wurde gebucht.
        </div>
      )}
      <ChatbotPopup />

      <style jsx>{`
        .container {
          width: 85%;
          max-width: 600px;
          margin: 3rem auto;
          padding: 2rem 1.5rem;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          color: #2c3e50;
        }

        h1 {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #34495e;
          font-weight: 700;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        label {
          font-weight: 600;
          color: #34495e;
          font-size: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        input,
        select,
        textarea {
          padding: 0.75rem 1rem;
          border-radius: 12px;
          border: 1.8px solid #d0d7de;
          font-size: 1rem;
          font-family: inherit;
          color: #2c3e50;
          background: #f9fafb;
          resize: vertical;
          transition: border-color 0.25s ease, background 0.25s ease;
        }

        input::placeholder,
        textarea::placeholder {
          color: #a0a8b9;
          font-style: italic;
        }

        input:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border-color: #4a90e2;
          background: #e6f0ff;
          box-shadow: 0 0 8px #a6c8ff88;
        }

        textarea {
          min-height: 90px;
        }

        .row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .row label {
          flex: 1 1 100%;
        }

        button {
          margin-top: 1rem;
          padding: 0.85rem;
          background: linear-gradient(90deg, #4a90e2 0%, #357abd 100%);
          border: none;
          border-radius: 14px;
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          box-shadow: 0 6px 15px rgba(53, 122, 189, 0.5);
          transition: background 0.3s ease;
        }

        button:disabled {
          background: #ccc;
          cursor: not-allowed;
          box-shadow: none;
        }

        button:hover:not(:disabled) {
          background: linear-gradient(90deg, #357abd 0%, #2a5f9e 100%);
        }

        .error-message {
          color: red;
          font-weight: 600;
          margin-top: 0.8rem;
        }

        .success-message {
          background-color: #28a745;
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 14px;
          font-weight: 700;
          text-align: center;
          margin-top: 1.5rem;
          box-shadow: 0 6px 20px #28a745aa;
        }

        @media (min-width: 520px) {
          .row label {
            flex: 1 1 calc(50% - 0.5rem);
          }
        }
      `}</style>
    </div>
  );
}
