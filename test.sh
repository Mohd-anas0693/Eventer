principal=$(dfx identity get-principal | grep -v "Decryption complete.")

dfx canister call attendance_proof_system_backend addOwner "($principal)"
dfx canister call attendance_proof_system_backend createEvent '(record {startTime= "1707721931227681640"; endTime= "2707721931227681640"; name= "ICP Event"; description= "This is the test event of the ICP"})'
# dfx canister call attendance_proof_system_backend  getEventIds 