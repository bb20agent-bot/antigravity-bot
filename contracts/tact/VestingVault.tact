import "@stdlib/deploy";

// Structs
struct VestingSchedule {
    beneficiary: Address;
    totalAmount: Int;
    releasedAmount: Int;
    cliffEnd: Int; // Timestamp
    linearEnd: Int; // Timestamp
    // Dynamic property controlled by OTC volume
    unlockMultiplier: Int; // e.g., 100 = 1.0x, 50 = 0.5x
}

// Messages
message AddBeneficiary {
    beneficiary: Address;
    amount: Int;
    cliffDuration: Int; // Seconds
    linearDuration: Int; // Seconds
}

message ReleaseTokens {
    beneficiary: Address;
}

message AdjustMultiplier {
    beneficiary: Address;
    newMultiplier: Int;
}

contract VestingVault with Deployable {
    owner: Address;
    voraTokenAddress: Address;
    schedules: map<Address, VestingSchedule>;

    init(owner: Address, voraTokenAddress: Address) {
        self.owner = owner;
        self.voraTokenAddress = voraTokenAddress;
    }

    receive(msg: AddBeneficiary) {
        require(sender() == self.owner, "Only owner can add beneficiaries");
        require(self.schedules.get(msg.beneficiary) == null, "Beneficiary already exists");

        let currentTime: Int = now();
        self.schedules.set(msg.beneficiary, VestingSchedule{
            beneficiary: msg.beneficiary,
            totalAmount: msg.amount,
            releasedAmount: 0,
            cliffEnd: currentTime + msg.cliffDuration,
            linearEnd: currentTime + msg.cliffDuration + msg.linearDuration,
            unlockMultiplier: 100 // Default 1x speed
        });
    }

    receive(msg: ReleaseTokens) {
        let schedule: VestingSchedule = self.schedules.get(msg.beneficiary)!!;
        require(schedule.totalAmount > 0, "No schedule found");
        
        // Calculate vested amount based on cliff and linear duration
        let vestedAmount: Int = self.calculateVestedAmount(schedule);
        let unreleased: Int = vestedAmount - schedule.releasedAmount;
        
        require(unreleased > 0, "No tokens due");

        // Request token transfer from VoraToken to Beneficiary
        // ... (Construct JettonTransfer)

        schedule.releasedAmount = schedule.releasedAmount + unreleased;
        self.schedules.set(msg.beneficiary, schedule);
    }

    receive(msg: AdjustMultiplier) {
        // This could be called by an Oracle or the Owner based on OTC volume
        require(sender() == self.owner, "Only owner/oracle can adjust");
        
        let schedule: VestingSchedule = self.schedules.get(msg.beneficiary)!!;
        require(schedule.totalAmount > 0, "No schedule found");
        
        // e.g., Low OTC volume -> newMultiplier = 50 (Half speed unlock)
        schedule.unlockMultiplier = msg.newMultiplier;
        self.schedules.set(msg.beneficiary, schedule);
    }

    fun calculateVestedAmount(schedule: VestingSchedule): Int {
        if (now() < schedule.cliffEnd) {
            return 0;
        } else if (now() >= schedule.linearEnd) {
            return schedule.totalAmount;
        } else {
            let passed: Int = now() - schedule.cliffEnd;
            let totalDuration: Int = schedule.linearEnd - schedule.cliffEnd;
            let baseVested: Int = (schedule.totalAmount * passed) / totalDuration;
            
            // Apply volume-based dynamic multiplier
            return (baseVested * schedule.unlockMultiplier) / 100;
        }
    }
}
