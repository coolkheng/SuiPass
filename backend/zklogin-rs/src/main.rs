use axum::{routing::get, routing::post, Json, Router};
mod salt;
mod proof;
use serde::{Deserialize, Serialize};
use rand::rngs::OsRng;
use ed25519_dalek::Keypair;
use base64::{engine::general_purpose, Engine as _};
use chrono::{Utc, Duration};
use uuid::Uuid;

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
    let app = Router::new()
        .route("/api/zklogin/salt", post(salt::salt_endpoint))
    println!("zklogin-rs backend running on http://localhost:4000");
    axum::Server::bind(&"0.0.0.0:4000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
