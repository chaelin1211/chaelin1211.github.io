'use client';

export default function Home() {
    return (
        <main>
            <div>
                <h1>Things to Learn</h1>

                <button
                    type="button"
                    onClick={() => {
                        fetch("http://localhost:8000/post-list")
                            .then((response) => response.json())
                            .then((payload) => {
                                console.log(payload)
                            });
                    }}
                >
                    Fetch List
                </button>
            </div>
        </main>
    )
}
