import { useMemo, useState } from "react";

const PASS_MARK = 40;

const initialStudents = [
  { id: 1, name: "Aman", score: 78 },
  { id: 2, name: "Riya", score: 45 },
  { id: 3, name: "Karan", score: 90 },
  { id: 4, name: "Neha", score: 32 }
];

const clampScore = (value) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return 0;
  return Math.max(0, Math.min(100, parsed));
};

function App() {
  const [students, setStudents] = useState(initialStudents);
  const [newStudent, setNewStudent] = useState({ name: "", score: "" });
  const [editScores, setEditScores] = useState(() =>
    initialStudents.reduce((acc, student) => {
      acc[student.id] = student.score;
      return acc;
    }, {})
  );

  const stats = useMemo(() => {
    const total = students.length;
    const passed = students.filter((student) => student.score >= PASS_MARK).length;
    const avgScore = total
      ? Math.round(students.reduce((sum, student) => sum + student.score, 0) / total)
      : 0;

    return { total, passed, avgScore };
  }, [students]);

  const handleAddStudent = (event) => {
    event.preventDefault();

    const name = newStudent.name.trim();
    if (!name) return;

    const score = clampScore(newStudent.score);
    const id = Date.now();

    setStudents((prev) => [...prev, { id, name, score }]);
    setEditScores((prev) => ({ ...prev, [id]: score }));
    setNewStudent({ name: "", score: "" });
  };

  const handleUpdateScore = (id) => {
    const nextScore = clampScore(editScores[id]);
    setStudents((prev) =>
      prev.map((student) => (student.id === id ? { ...student, score: nextScore } : student))
    );
    setEditScores((prev) => ({ ...prev, [id]: nextScore }));
  };

  return (
    <main className="app-shell">
      <div className="page">
        <header className="title-wrap">
          <p className="eyebrow">
            <span className="eyebrow-line" aria-hidden="true" />
            <span className="eyebrow-text">Academic Terminal v2.0</span>
            <span className="eyebrow-line" aria-hidden="true" />
          </p>
          <h1>
            Student <span>Scoreboard</span>
          </h1>
        </header>

        <section className="panel-block panel-block--register" aria-label="Register student">
          <form className="register-grid" onSubmit={handleAddStudent}>
            <div className="row-label">
              <span>Register Student</span>
              <span>New Entry</span>
            </div>
            <input
              type="text"
              placeholder="Student name"
              value={newStudent.name}
              onChange={(event) =>
                setNewStudent((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
            <input
              type="number"
              min="0"
              max="100"
              placeholder="Score (0-100)"
              value={newStudent.score}
              onChange={(event) =>
                setNewStudent((prev) => ({ ...prev, score: event.target.value }))
              }
              required
            />
            <button type="submit" className="add-btn">
              <span className="add-btn__fill" aria-hidden="true" />
              <span className="add-btn__label">+ Add</span>
            </button>
          </form>
        </section>

        <section className="panel-block panel-block--stats" aria-label="Summary statistics">
          <div className="stats-grid">
            <article className="stat-card">
              <p>Total</p>
              <strong>{stats.total}</strong>
            </article>
            <article className="stat-card">
              <p>Passed</p>
              <strong>{stats.passed}</strong>
            </article>
            <article className="stat-card">
              <p>Avg. Score</p>
              <strong>{stats.avgScore}</strong>
            </article>
          </div>
        </section>

        <section className="panel-block panel-block--records" aria-label="Student records">
          <div className="table-wrap">
            <header>
              <h2>Student Records</h2>
              <span>{students.length} entries</span>
            </header>

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const passed = student.score >= PASS_MARK;
                  return (
                    <tr key={student.id} className={passed ? "row-pass" : "row-fail"}>
                      <td className="name-cell">{student.name}</td>
                      <td className="score-cell">{student.score}</td>
                      <td>
                        <span className={`status ${passed ? "pass" : "fail"}`}>
                          {passed ? "Pass" : "Fail"}
                        </span>
                      </td>
                      <td className="update-cell">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editScores[student.id] ?? student.score}
                          onChange={(event) =>
                            setEditScores((prev) => ({
                              ...prev,
                              [student.id]: event.target.value
                            }))
                          }
                        />
                        <button type="button" onClick={() => handleUpdateScore(student.id)}>
                          Save
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;

