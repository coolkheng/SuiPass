// sources/policy.move - Define a Seal access policy (allowlist-based)
// This module defines a Policy that restricts decryption keys to an owner and optional allowlist.
module seal_policy::policy {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::dynamic_field as df;
    use sui::tx_context::{Self, TxContext};
    use std::vector;

    const ENotOwner: u64 = 0;
    const EAlreadyMember: u64 = 1;
    const ENoAccess: u64 = 2;
    const MARKER: u64 = 3; // value stored for dynamic field entries (not used in logic)

    // Policy struct: holds owner address and allowlist of additional members.
    // Marked as shared (has key) so it can be used in Seal's on-chain checks by any user.
    struct Policy has key {
        id: UID,               // Unique object ID for this policy
        name: vector<u8>,      // Name or identifier (utf-8 bytes)
        owner: address,        // Owner address (always authorized)
        members: vector<address>, // Additional allowlisted addresses
    }

    /// Create a new Policy object with the transaction sender as owner.
    /// The policy is created as a shared object so it can be used in Seal key policy checks.
    public entry fun create_policy(name: vector<u8>, ctx: &mut TxContext) {
        let policy = Policy {
            id: object::new(ctx),
            name,
            owner: tx_context::sender(ctx),
            members: vector::empty() // start with no extra members
        };
        transfer::share_object(policy); // Make it a shared object (globally accessible)
    }

    /// Add a new member to the policy's allowlist.
    /// Only the policy owner can call this (ctx.sender must match policy.owner).
    public entry fun add_member(policy: &mut Policy, member: address, ctx: &TxContext) {
        assert!(tx_context::sender(ctx) == policy.owner, ENotOwner);
        // Ensure member not already in list
        assert!(!vector::contains(&policy.members, &member), EAlreadyMember);
        vector::push_back(&mut policy.members, member);
    }

    /// Remove a member from the allowlist. Only owner can remove.
    public entry fun remove_member(policy: &mut Policy, member: address, ctx: &TxContext) {
        assert!(tx_context::sender(ctx) == policy.owner, ENotOwner);
        let (found, index) = vector::index_of(&policy.members, &member);
        if (found) {
            vector::remove(&mut policy.members, index);
        };
    }

    /// Approve access to a decryption key (called by Seal key servers via dry-run).
    /// `id` is the requested identity (key ID) bytes (excluding the package ID prefix).
    /// Returns () if access is granted, aborts with ENoAccess if not.
    public entry fun seal_approve(id: vector<u8>, policy: &Policy, ctx: &TxContext) {
        // Check that the key ID starts with this policy's ID bytes (policy namespace)
        let namespace = object::id_bytes(policy);                    // unique ID bytes for policy
        let has_prefix = is_prefix(&namespace, &id);
        if (!has_prefix) {
            abort ENoAccess
        };
        // Access is allowed if caller (ctx.sender) is owner or in members list
        let caller = tx_context::sender(ctx);
        if (!(caller == policy.owner || vector::contains(&policy.members, &caller))) {
            abort ENoAccess
        };
        // If we reach here, caller is authorized; return () (success)
    }

    /// Attach a Walrus blob reference to this policy (for on-chain tracking of content).
    /// Only owner can publish a blob reference. Blob_id is a string (hex or arbitrary) to index the content.
    public entry fun publish_blob(policy: &mut Policy, blob_id: vector<u8>, ctx: &TxContext) {
        assert!(tx_context::sender(ctx) == policy.owner, ENotOwner);
        // Use Dynamic Field to attach blob_id -> MARKER (as a simple existence marker)
        df::add(&mut policy.id, blob_id, MARKER);
    }

    /// Check if `prefix` is a prefix of `data`.
    fun is_prefix(prefix: &vector<u8>, data: &vector<u8>): bool {
        let n = vector::length(prefix);
        if (n > vector::length(data)) {
            return false
        };
        let i = 0;
        while (i < n) {
            if (vector::borrow(prefix, i) != vector::borrow(data, i)) {
                return false
            };
            i = i + 1;
        };
        true
    }

    #[test_only]
    public fun new_test_policy(ctx: &mut TxContext): Policy {
        // Create a test Policy with owner = ctx.sender()
        let p = Policy {
            id: object::new(ctx),
            name: b"test",
            owner: tx_context::sender(ctx),
            members: vector::empty()
        };
        transfer::share_object(p);
        p
    }

    #[test_only]
    public fun destroy_test_policy(policy: Policy) {
        // Delete policy object in tests
        let Policy { id, name: _, owner: _, members: _ } = policy;
        object::delete(id);
    }
}
