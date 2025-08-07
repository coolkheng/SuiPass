use axum::{routing::get, routing::post, Json, Router};
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

async fn generate_nonce() -> Json<NonceResponse> {
    // Generate ephemeral keypair
    let keypair = Keypair::generate(&mut OsRng);
    let eph_pk = base64::encode(keypair.public.as_bytes());

    // Set expiry (e.g., 1 hour from now)
    let max_epoch = (Utc::now() + Duration::hours(1)).timestamp();

    // Generate randomness
    let jwt_randomness = Uuid::new_v4().to_string();

    // Build nonce struct
    let nonce = Nonce {
        eph_pk,
        max_epoch,
        jwt_randomness,
    };

    // Serialize and base64 encode
    let json = serde_json::to_string(&nonce).unwrap();
    let encoded = general_purpose::STANDARD.encode(json);
    Json(NonceResponse { nonce: encoded })
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/api/zklogin/nonce", get(generate_nonce));
    println!("zklogin-rs backend running on http://localhost:4000");
    axum::Server::bind(&"0.0.0.0:4000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
