import { TextSelection } from 'prosemirror-state';
import { markApplies } from 'ngx-editor/helpers';
// Ref: https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js
export const applyMark = (type, attrs = {}) => {
    return (state, dispatch) => {
        const { tr, selection } = state;
        const { empty, ranges, $from, $to } = selection;
        if (empty && selection instanceof TextSelection) {
            const { $cursor } = selection;
            if (!$cursor || !markApplies(state.doc, ranges, type)) {
                return false;
            }
            tr.addStoredMark(type.create(attrs));
            if (!tr.storedMarksSet) {
                return false;
            }
            dispatch === null || dispatch === void 0 ? void 0 : dispatch(tr);
        }
        else {
            tr.addMark($from.pos, $to.pos, type.create(attrs));
            if (!tr.docChanged) {
                return false;
            }
            dispatch === null || dispatch === void 0 ? void 0 : dispatch(tr.scrollIntoView());
        }
        return true;
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbHlNYXJrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbmd4LWVkaXRvci9jb21tYW5kcy9hcHBseU1hcmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFlLGFBQWEsRUFBZSxNQUFNLG1CQUFtQixDQUFDO0FBRTVFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUVqRCx1RkFBdUY7QUFDdkYsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFHLENBQUMsSUFBYyxFQUFFLFFBQTZCLEVBQUUsRUFBVyxFQUFFO0lBQ3BGLE9BQU8sQ0FBQyxLQUFrQixFQUFFLFFBQW9DLEVBQVcsRUFBRTtRQUMzRSxNQUFNLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxHQUFHLEtBQUssQ0FBQztRQUNoQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsU0FBUyxDQUFDO1FBRWhELElBQUksS0FBSyxJQUFJLFNBQVMsWUFBWSxhQUFhLEVBQUU7WUFDL0MsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLFNBQVMsQ0FBQztZQUU5QixJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUNyRCxPQUFPLEtBQUssQ0FBQzthQUNkO1lBRUQsRUFBRSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUU7Z0JBQ3RCLE9BQU8sS0FBSyxDQUFDO2FBQ2Q7WUFFRCxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUcsRUFBRSxFQUFFO1NBQ2hCO2FBQU07WUFDTCxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFFbkQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUU7Z0JBQ2xCLE9BQU8sS0FBSyxDQUFDO2FBQ2Q7WUFFRCxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUcsRUFBRSxDQUFDLGNBQWMsRUFBRSxFQUFFO1NBQ2pDO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDLENBQUM7QUFDSixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXJrVHlwZSB9IGZyb20gJ3Byb3NlbWlycm9yLW1vZGVsJztcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICdwcm9zZW1pcnJvci1jb21tYW5kcyc7XG5pbXBvcnQgeyBFZGl0b3JTdGF0ZSwgVGV4dFNlbGVjdGlvbiwgVHJhbnNhY3Rpb24gfSBmcm9tICdwcm9zZW1pcnJvci1zdGF0ZSc7XG5cbmltcG9ydCB7IG1hcmtBcHBsaWVzIH0gZnJvbSAnbmd4LWVkaXRvci9oZWxwZXJzJztcblxuLy8gUmVmOiBodHRwczovL2dpdGh1Yi5jb20vUHJvc2VNaXJyb3IvcHJvc2VtaXJyb3ItY29tbWFuZHMvYmxvYi9tYXN0ZXIvc3JjL2NvbW1hbmRzLmpzXG5leHBvcnQgY29uc3QgYXBwbHlNYXJrID0gKHR5cGU6IE1hcmtUeXBlLCBhdHRyczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9KTogQ29tbWFuZCA9PiB7XG4gIHJldHVybiAoc3RhdGU6IEVkaXRvclN0YXRlLCBkaXNwYXRjaD86ICh0cjogVHJhbnNhY3Rpb24pID0+IHZvaWQpOiBib29sZWFuID0+IHtcbiAgICBjb25zdCB7IHRyLCBzZWxlY3Rpb24gfSA9IHN0YXRlO1xuICAgIGNvbnN0IHsgZW1wdHksIHJhbmdlcywgJGZyb20sICR0byB9ID0gc2VsZWN0aW9uO1xuXG4gICAgaWYgKGVtcHR5ICYmIHNlbGVjdGlvbiBpbnN0YW5jZW9mIFRleHRTZWxlY3Rpb24pIHtcbiAgICAgIGNvbnN0IHsgJGN1cnNvciB9ID0gc2VsZWN0aW9uO1xuXG4gICAgICBpZiAoISRjdXJzb3IgfHwgIW1hcmtBcHBsaWVzKHN0YXRlLmRvYywgcmFuZ2VzLCB0eXBlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHRyLmFkZFN0b3JlZE1hcmsodHlwZS5jcmVhdGUoYXR0cnMpKTtcbiAgICAgIGlmICghdHIuc3RvcmVkTWFya3NTZXQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBkaXNwYXRjaD8uKHRyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdHIuYWRkTWFyaygkZnJvbS5wb3MsICR0by5wb3MsIHR5cGUuY3JlYXRlKGF0dHJzKSk7XG5cbiAgICAgIGlmICghdHIuZG9jQ2hhbmdlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGRpc3BhdGNoPy4odHIuc2Nyb2xsSW50b1ZpZXcoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG59O1xuIl19