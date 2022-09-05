import { Map } from 'immutable';
import qe from 'utils/quasi-equals';

// work out actors for entities and store activites both direct as well as indirect
export const getActorsForEntities = (
  actions,
  actors,
  subject = 'actors',
  includeIndirect = true,
  withConnectionAttributes,
) => {
  const actionAtt = subject === 'actors'
    ? 'actors'
    : 'targets';
  const actionAttMembers = subject === 'actors'
    ? 'actorsMembers'
    : 'targetsMembers';
  const actorAtt = subject === 'actors'
    ? 'actions'
    : 'targetingActions';
  const actorAttMembers = subject === 'actors'
    ? 'actionsMembers'
    : 'targetingActionsAsMember';
  const actionConnectionAttributesAtt = 'actorsAttributes';
  let actionActorConnectionAttributes;

  return actions && actions.reduce(
    (memo, action) => {
      // memo: actors with actions
      const actionId = parseInt(action.get('id'), 10);
      // get actors for action
      const actionActors = action.get(actionAtt);
      if (withConnectionAttributes) {
        actionActorConnectionAttributes = action.get(actionConnectionAttributesAtt);
      }
      // for each actor figure out related actions/ids
      let result = actionActors
        ? actionActors.reduce(
          (memo2, actorId) => {
            let result2 = memo2;
            // memo2: actors with actions
            const sActorId = actorId.toString();
            // if actor already stored, add actions/ids
            if (memo2.get(sActorId)) {
              // if we already have an active list for actor, add it
              if (memo2.getIn([sActorId, actorAtt])) {
                result2 = result2.setIn(
                  [sActorId, actorAtt],
                  memo2.getIn([sActorId, actorAtt]).set(
                    actionId,
                    actionActorConnectionAttributes
                      ? actionActorConnectionAttributes.find(
                        (connection) => qe(connection.get('measure_id'), actionId)
                          && qe(connection.get('actor_id'), sActorId)
                      )
                      : Map({ measure_id: actionId })
                  ),
                );
              } else {
                result2 = result2.setIn(
                  [sActorId, actorAtt],
                  Map().set(
                    actionId,
                    actionActorConnectionAttributes
                      ? actionActorConnectionAttributes.find(
                        (connection) => qe(connection.get('measure_id'), actionId)
                          && qe(connection.get('actor_id'), sActorId)
                      )
                      : Map({ measure_id: actionId })
                  ),
                );
              }
              // remove from indirect/member list if already added there
              if (includeIndirect
                && memo2.getIn([sActorId, actorAttMembers])
                && memo2.getIn([sActorId, actorAttMembers]).keySeq().includes(actionId)
              ) {
                result2 = result2.setIn(
                  [sActorId, actorAttMembers],
                  memo2.getIn([sActorId, actorAttMembers]).delete(actionId),
                );
              }
            } else {
              const actor = actors.get(sActorId);
              result2 = result2.set(
                sActorId,
                actor.set(
                  actorAtt,
                  Map().set(
                    actionId,
                    actionActorConnectionAttributes
                      ? actionActorConnectionAttributes.find(
                        (connection) => qe(connection.get('measure_id'), actionId)
                          && qe(connection.get('actor_id'), sActorId)
                      )
                      : Map({ measure_id: actionId })
                  )
                )
              );
            }
            return result2;
          },
          memo,
        )
        : memo;
      if (includeIndirect) {
        const actionActorsAsMember = action.get(actionAttMembers);
        result = actionActorsAsMember
          ? actionActorsAsMember.reduce(
            (memo2, actorId) => {
              // memo2: actors with direct actions
              let result2 = memo2;
              // memo2: actors with actions
              const sActorId = actorId.toString();
              // makes sure not already included in direct action
              if (
                !memo2.getIn([sActorId, actorAtt])
                || !memo2.getIn([sActorId, actorAtt]).keySeq().includes(actionId)
              ) {
                // if already present, add action id
                if (memo2.get(sActorId)) {
                  if (memo2.getIn([sActorId, actorAttMembers])) {
                    if (!memo2.getIn([sActorId, actorAttMembers]).keySeq().includes(actionId)) {
                      result2 = result2.setIn(
                        [sActorId, actorAttMembers],
                        memo2.getIn([sActorId, actorAttMembers]).set(
                          actionId,
                          Map({ measure_id: actionId })
                        ),
                      );
                    }
                  } else {
                    result2 = result2.setIn(
                      [sActorId, actorAttMembers],
                      Map().set(
                        actionId,
                        Map({ measure_id: actionId })
                      ),
                    );
                  }
                } else {
                  const actor = actors.get(sActorId);
                  result2 = actor
                    ? result2.set(
                      sActorId,
                      actor.set(
                        actorAttMembers,
                        Map().set(
                          actionId,
                          Map({ measure_id: actionId }),
                        ),
                      ),
                    )
                    : result2;
                }
              }
              return result2;
            },
            result,
          )
          : result;
      }
      return result;
    },
    Map(),
  ).toList();
};
