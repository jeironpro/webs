export function toggleVote(state, partyId) {
    const party = state.parties.find((item) => item.id === partyId);
    if (!party) {
        return null;
    }

    if (state.voteId === partyId) {
        party.votes = Math.max(0, party.votes - 1);
        state.voteId = null;
        return { action: "unvote", party };
    }

    const previous = state.parties.find((item) => item.id === state.voteId);
    if (previous) {
        previous.votes = Math.max(0, previous.votes - 1);
    }

    party.votes += 1;
    state.voteId = partyId;
    return { action: previous ? "move" : "vote", party };
}
