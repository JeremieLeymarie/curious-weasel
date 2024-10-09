defmodule TimeTrackerWeb.UserJSON do
  alias TimeTracker.UserContext.User

  @doc """
  Renders a list of users.
  """
  def index(%{users: users}) do
    %{data: for(user <- users, do: data(user))}
  end

  @doc """
  Renders a single user.
  """
  def show(%{user: user}) do
    %{data: data(user)}
  end

  defp data(%User{} = user) do
    result = %{
      id: user.id,
      username: user.username,
      email: user.email,
      clocks: nil,
      working_times: nil
    }

    clocks =
      if Ecto.assoc_loaded?(user.clocks) do
        for(clock <- user.clocks, do: %{id: clock.id, time: clock.time, status: clock.status})
      else
        nil
      end

    working_times =
      if Ecto.assoc_loaded?(user.working_times) do
        for(
          working_time <- user.working_times,
          do: %{id: working_time.id, start: working_time.start, end: working_time.end}
        )
      else
        nil
      end

    result = %{result | clocks: clocks}
    %{result | working_times: working_times}
  end
end
