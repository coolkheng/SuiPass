use axum::{routing::post, Router};
use tower_http::cors::{CorsLayer, Any};
mod salt;
// mod proof; // (Commented out: file does not exist)
use serde::{Deserialize, Serialize};
// use rand::rngs::OsRng;
// use ed25519_dalek::Keypair;
// use base64::{engine::general_purpose, Engine as _};
// use chrono::{Utc, Duration};
// use uuid::Uuid;

#[derive(Serialize, Deserialize)]
struct Nonce {
    eph_pk: String,
    max_epoch: i64,
    jwt_randomness: String,
}

#[derive(Serialize, Deserialize)]
struct NonceResponse {
    nonce: String,
}



#[tokio::main]
async fn main() {
    let cors = CorsLayer::new()
        .allow_origin(["http://localhost:3000".parse().unwrap()])
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/api/zklogin/salt", post(salt::salt_endpoint))
        .layer(cors);
    println!("zklogin-rs backend running on http://localhost:4000");
    let listener = tokio::net::TcpListener::bind("0.0.0.0:4000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
