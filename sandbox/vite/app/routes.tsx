import {
  type RouteConfig,
  index,
  route,
} from "@react-router/dev/routes";

export default [
  index("pages/index.tsx"),
  route("about", "pages/about.tsx"),
] satisfies RouteConfig;
