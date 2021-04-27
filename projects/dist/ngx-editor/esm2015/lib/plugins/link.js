import { Fragment, Slice } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
const HTTP_LINK_REGEX = /((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)$/;
const linkify = (fragment) => {
    const linkified = [];
    fragment.forEach((child) => {
        if (child.isText) {
            const text = child.text;
            let pos = 0;
            const match = HTTP_LINK_REGEX.exec(text);
            if (match) {
                const start = match.index;
                const end = start + match[0].length;
                const link = child.type.schema.marks.link;
                if (start > 0) {
                    linkified.push(child.cut(pos, start));
                }
                const urlText = text.slice(start, end);
                linkified.push(child.cut(start, end).mark(link.create({ href: urlText }).addToSet(child.marks)));
                pos = end;
            }
            if (pos < text.length) {
                linkified.push(child.cut(pos));
            }
        }
        else {
            linkified.push(child.copy(linkify(child.content)));
        }
    });
    return Fragment.fromArray(linkified);
};
const linkPlugin = () => {
    return new Plugin({
        key: new PluginKey('link'),
        props: {
            transformPasted: (slice) => {
                return new Slice(linkify(slice.content), slice.openStart, slice.openEnd);
            }
        }
    });
};
export default linkPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL25neC1lZGl0b3Ivc3JjL2xpYi9wbHVnaW5zL2xpbmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQTJCLE1BQU0sbUJBQW1CLENBQUM7QUFDN0UsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUV0RCxNQUFNLGVBQWUsR0FBRyxzREFBc0QsQ0FBQztBQUUvRSxNQUFNLE9BQU8sR0FBRyxDQUFDLFFBQWtCLEVBQVksRUFBRTtJQUMvQyxNQUFNLFNBQVMsR0FBc0IsRUFBRSxDQUFDO0lBRXhDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFzQixFQUFFLEVBQUU7UUFDMUMsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ2hCLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFjLENBQUM7WUFDbEMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBRVosTUFBTSxLQUFLLEdBQTRCLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFbEUsSUFBSSxLQUFLLEVBQUU7Z0JBQ1QsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDMUIsTUFBTSxHQUFHLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7Z0JBQ3BDLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7Z0JBRTFDLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtvQkFDYixTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7aUJBQ3ZDO2dCQUVELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN2QyxTQUFTLENBQUMsSUFBSSxDQUNaLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUNqRixDQUFDO2dCQUNGLEdBQUcsR0FBRyxHQUFHLENBQUM7YUFDWDtZQUVELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ3JCLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ2hDO1NBQ0Y7YUFBTTtZQUNMLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNwRDtJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxRQUFRLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3ZDLENBQUMsQ0FBQztBQUVGLE1BQU0sVUFBVSxHQUFHLEdBQUcsRUFBRTtJQUN0QixPQUFPLElBQUksTUFBTSxDQUFDO1FBQ2hCLEdBQUcsRUFBRSxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFDMUIsS0FBSyxFQUFFO1lBQ0wsZUFBZSxFQUFFLENBQUMsS0FBWSxFQUFFLEVBQUU7Z0JBQ2hDLE9BQU8sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMzRSxDQUFDO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFFRixlQUFlLFVBQVUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZyYWdtZW50LCBTbGljZSwgTm9kZSBhcyBQcm9zZU1pcnJvck5vZGUgfSBmcm9tICdwcm9zZW1pcnJvci1tb2RlbCc7XG5pbXBvcnQgeyBQbHVnaW4sIFBsdWdpbktleSB9IGZyb20gJ3Byb3NlbWlycm9yLXN0YXRlJztcblxuY29uc3QgSFRUUF9MSU5LX1JFR0VYID0gLygoaHR0cHM/OlxcL1xcLyk/W1xcdy1dKyhcXC5bXFx3LV0rKStcXC4/KDpcXGQrKT8oXFwvXFxTKik/KSQvO1xuXG5jb25zdCBsaW5raWZ5ID0gKGZyYWdtZW50OiBGcmFnbWVudCk6IEZyYWdtZW50ID0+IHtcbiAgY29uc3QgbGlua2lmaWVkOiBQcm9zZU1pcnJvck5vZGVbXSA9IFtdO1xuXG4gIGZyYWdtZW50LmZvckVhY2goKGNoaWxkOiBQcm9zZU1pcnJvck5vZGUpID0+IHtcbiAgICBpZiAoY2hpbGQuaXNUZXh0KSB7XG4gICAgICBjb25zdCB0ZXh0ID0gY2hpbGQudGV4dCBhcyBzdHJpbmc7XG4gICAgICBsZXQgcG9zID0gMDtcblxuICAgICAgY29uc3QgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXkgfCBudWxsID0gSFRUUF9MSU5LX1JFR0VYLmV4ZWModGV4dCk7XG5cbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICBjb25zdCBzdGFydCA9IG1hdGNoLmluZGV4O1xuICAgICAgICBjb25zdCBlbmQgPSBzdGFydCArIG1hdGNoWzBdLmxlbmd0aDtcbiAgICAgICAgY29uc3QgbGluayA9IGNoaWxkLnR5cGUuc2NoZW1hLm1hcmtzLmxpbms7XG5cbiAgICAgICAgaWYgKHN0YXJ0ID4gMCkge1xuICAgICAgICAgIGxpbmtpZmllZC5wdXNoKGNoaWxkLmN1dChwb3MsIHN0YXJ0KSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1cmxUZXh0ID0gdGV4dC5zbGljZShzdGFydCwgZW5kKTtcbiAgICAgICAgbGlua2lmaWVkLnB1c2goXG4gICAgICAgICAgY2hpbGQuY3V0KHN0YXJ0LCBlbmQpLm1hcmsobGluay5jcmVhdGUoeyBocmVmOiB1cmxUZXh0IH0pLmFkZFRvU2V0KGNoaWxkLm1hcmtzKSlcbiAgICAgICAgKTtcbiAgICAgICAgcG9zID0gZW5kO1xuICAgICAgfVxuXG4gICAgICBpZiAocG9zIDwgdGV4dC5sZW5ndGgpIHtcbiAgICAgICAgbGlua2lmaWVkLnB1c2goY2hpbGQuY3V0KHBvcykpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsaW5raWZpZWQucHVzaChjaGlsZC5jb3B5KGxpbmtpZnkoY2hpbGQuY29udGVudCkpKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBGcmFnbWVudC5mcm9tQXJyYXkobGlua2lmaWVkKTtcbn07XG5cbmNvbnN0IGxpbmtQbHVnaW4gPSAoKSA9PiB7XG4gIHJldHVybiBuZXcgUGx1Z2luKHtcbiAgICBrZXk6IG5ldyBQbHVnaW5LZXkoJ2xpbmsnKSxcbiAgICBwcm9wczoge1xuICAgICAgdHJhbnNmb3JtUGFzdGVkOiAoc2xpY2U6IFNsaWNlKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgU2xpY2UobGlua2lmeShzbGljZS5jb250ZW50KSwgc2xpY2Uub3BlblN0YXJ0LCBzbGljZS5vcGVuRW5kKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgbGlua1BsdWdpbjtcbiJdfQ==