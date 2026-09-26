import { COURSES } from '../data/courses/courses';
import { HOLE_LAYOUTS } from '../data/holes';
import type { CourseData, HoleLayout, HoleSummary } from '../data/types';

/** Read-only access to real courses and the holes that have been recreated. */
export const CourseDatabase = {
  all(): CourseData[] {
    return COURSES;
  },
  course(id: string): CourseData {
    const c = COURSES.find((x) => x.id === id);
    if (!c) throw new Error(`Unknown course ${id}`);
    return c;
  },
  layout(id: string): HoleLayout {
    const l = HOLE_LAYOUTS.find((x) => x.id === id);
    if (!l) throw new Error(`Unknown hole layout ${id}`);
    return l;
  },
  layouts(): HoleLayout[] {
    return HOLE_LAYOUTS;
  },
  builtHoles(courseId: string): HoleSummary[] {
    return this.course(courseId).holes.filter((h) => h.layoutId);
  },
  /** Distance of the mini hole in feet (tee to cup). */
  miniFeet(layout: HoleLayout): number {
    return Math.round(Math.hypot(layout.cup[0] - layout.tee.at[0], layout.cup[1] - layout.tee.at[1]));
  },
  signatureLayout(courseId: string): HoleLayout | undefined {
    const c = this.course(courseId);
    const sig = c.holes.find((h) => h.number === c.signatureHole && h.layoutId);
    const any = sig ?? c.holes.find((h) => h.layoutId);
    return any?.layoutId ? this.layout(any.layoutId) : undefined;
  },
};
