import { useState, useEffect } from "react";
import { RiRefreshLine } from "react-icons/ri";
import { supabase } from "./supabase";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleDelete = async (id) => {
    await supabase.from("appointments").delete().match({ id });
    loadAppointments();
  };

  const loadAppointments = async () => {
    const { data, error } = await supabase.from("appointments").select("*");
    if (data) {
      data.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
      });
      const now = new Date();
      const updatedData = data.map((entry) => {
        const dateTimeString = `${entry.date}T${entry.time}`;
        const appointmentDate = new Date(dateTimeString);
        const expired = appointmentDate < now;
        return { ...entry, expired };
      });
      setAppointments(updatedData);
    }
    if (error) {
      setAppointments([]);
    }
  };

  return (
    <div className="container">
      <button className="refresh-button" onClick={loadAppointments}>
        <RiRefreshLine />
      </button>
      <h1>Gebuchte Termine</h1>

      {appointments.length === 0 ? (
        <p className="no-appointments">Keine Termine gebucht.</p>
      ) : (
        <ul className="appointments-list">
          {appointments
            .filter((entry) => !entry.expired)
            .map(({ id, name, email, phone, date, time, message, expired }) => (
              <li
                key={id}
                className={`appointment-item ${expired ? "expired" : ""}`}
              >
                <div className="header">
                  <strong>{name}</strong>
                  <span>
                    {date} | {time}
                  </span>
                </div>
                <div className="contact">
                  <span>Email: {email}</span>
                  <span>Telefon: {phone}</span>
                </div>
                {message && <p className="message">{message}</p>}
                <span
                  className="button-status"
                  style={{ backgroundColor: expired ? "red" : "green" }}
                ></span>
                <button
                  onClick={() => handleDelete(id)}
                  aria-label="Termin löschen"
                  title="Termin löschen"
                  className="delete-button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    width="20"
                    height="20"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
                    />
                  </svg>
                </button>
              </li>
            ))}
          <h1>Abgelaufende Termine</h1>
          {appointments
            .filter((entry) => entry.expired)
            .map(({ id, name, email, phone, date, time, message, expired }) => (
              <li
                key={id}
                className={`appointment-item ${expired ? "expired" : ""}`}
              >
                <div className="header">
                  <strong>{name}</strong>
                  <span>
                    {date} | {time}
                  </span>
                </div>
                <div className="contact">
                  <span>Email: {email}</span>
                  <span>Telefon: {phone}</span>
                </div>
                {message && <p className="message">{message}</p>}
                <span
                  className="button-status"
                  style={{ backgroundColor: expired ? "red" : "green" }}
                ></span>
                <button
                  onClick={() => handleDelete(id)}
                  aria-label="Termin löschen"
                  title="Termin löschen"
                  className="delete-button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    width="20"
                    height="20"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
                    />
                  </svg>
                </button>
              </li>
            ))}
        </ul>
      )}

      <style jsx>{`
        .container {
          width: 85%;
          max-width: 600px;
          margin: 2rem auto;
          padding: 1.5rem;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          color: #2c3e50;
        }

        .refresh-button {
          background-color: #3498db;
          color: white;
          padding: 0.5rem 0.7rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-bottom: 1rem;
          float: right;
        }

        .refresh-button:hover {
          background-color: #2980b9;
        }

        h1 {
          text-align: center;
          color: #34495e;
          margin-bottom: 1.5rem;
          clear: both;
        }

        .no-appointments {
          font-style: italic;
          text-align: center;
          color: #7f8c8d;
        }

        .appointments-list {
          list-style: none;
          padding: 0;
          margin: 0;
          border-top: 2px solid #4a90e2;
          border-radius: 12px;
        }

        .appointment-item {
          padding: 1rem;
          border-bottom: 1px solid #e1e4e8;
          background: #f7f9fc;
          border-radius: 0 0 12px 12px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .appointment-item:hover {
          background: #e9f0ff;
        }

        .header {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .header strong {
          font-size: 1.1rem;
        }

        .header span {
          font-size: 0.9rem;
          color: #555;
        }

        .contact {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          font-size: 0.85rem;
          color: #566573;
        }

        .message {
          font-style: italic;
          color: #34495e;
          font-size: 0.9rem;
        }

        .expired {
          color: gray;
          text-decoration: line-through;
          font-style: italic;
        }

        .button-status {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid rgba(0, 0, 0, 0.27);
        }

        .delete-button {
          background: transparent;
          border: none;
          color: #e74c3c;
          cursor: pointer;
          padding: 0;
          width: fit-content;
          display: flex;
          align-items: center;
          transition: color 0.3s ease;
          align-self: flex-end;
        }

        .delete-button:hover {
          color: #c0392b;
        }

        /* Tablet & up */
        @media (min-width: 600px) {
          .appointment-item {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .header {
            flex: 1 1 40%;
          }

          .contact {
            flex: 1 1 40%;
          }

          .message {
            flex: 1 1 100%;
          }

          .delete-button {
            margin-left: auto;
            margin-top: 0;
          }
        }
      `}</style>
    </div>
  );
}
