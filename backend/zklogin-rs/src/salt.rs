use axum::{Json, response::IntoResponse};
use serde::{Deserialize, Serialize};
use sha2::Sha256;
use hkdf::Hkdf;

#[derive(Deserialize)]
pub struct SaltRequest {
    pub iss: String,
    pub aud: String,
    pub sub: String,
}

#[derive(Serialize)]
pub struct SaltResponse {
    pub user_salt: String,
}


use std::env;

fn get_master_seed() -> Vec<u8> {
    dotenvy::dotenv().ok();
    let hex = env::var("ZKLOGIN_SALT").expect("ZKLOGIN_SALT env var not set");
    let bytes = hex::decode(hex).expect("ZKLOGIN_SALT must be valid hex");
    assert_eq!(bytes.len(), 32, "ZKLOGIN_SALT must be 32 bytes (64 hex chars)");
    bytes
}

pub async fn salt_endpoint(Json(payload): Json<SaltRequest>) -> impl IntoResponse {
    // Option 4: Derive user salt using HKDF(master_seed, salt=iss||aud, info=sub)
    let master_seed = get_master_seed();
    let salt = [payload.iss.as_bytes(), payload.aud.as_bytes()].concat();
    let info = payload.sub.as_bytes();
    let hk = Hkdf::<Sha256>::new(Some(&salt), &master_seed);
    let mut okm = [0u8; 16];
    hk.expand(info, &mut okm).expect("HKDF expand failed");
    let user_salt = hex::encode(okm);
    Json(SaltResponse { user_salt })
}
