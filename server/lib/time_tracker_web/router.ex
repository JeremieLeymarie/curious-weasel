defmodule TimeTrackerWeb.Router do
  use TimeTrackerWeb, :router

  pipeline :api do
    plug(:accepts, ["json"])
    plug(:fetch_session)
  end

  pipeline :auth do
    plug TimeTracker.GuardianPipeline
  end

  scope "/api", TimeTrackerWeb do
    pipe_through(:api)

    post("/users/register", UserController, :sign_user_up)
    post("/users/sign_in", UserController, :sign_in)
  end

  scope "/api", TimeTrackerWeb do
    pipe_through([:api, :auth])

    resources("/users", UserController, except: [:new, :edit])
    resources("/workingtimes", WorkingTimeController, only: [:update, :delete])

    get("/workingtimes/:userId", WorkingTimeController, :index)
    get("/workingtimes/team/:teamId", WorkingTimeController, :list_team_working_times)
    post("/workingtimes/:userId", WorkingTimeController, :create)
    get("/workingtimes/:userId/:id", WorkingTimeController, :show_user_working_time)

    get("/clocks/:userId", ClockController, :index)
    put("/clocks/:id", ClockController, :update)
    post("/clocks/:userId", ClockController, :create)

    post("/teams", TeamController, :create)
    get("/teams", TeamController, :index)
    get("/teams/:id", TeamController, :show)
    put("/teams/:id", TeamController, :update)
  end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:time_tracker, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through([:fetch_session, :protect_from_forgery])

      live_dashboard("/dashboard", metrics: TimeTrackerWeb.Telemetry)
      forward("/mailbox", Plug.Swoosh.MailboxPreview)
    end
  end
end
