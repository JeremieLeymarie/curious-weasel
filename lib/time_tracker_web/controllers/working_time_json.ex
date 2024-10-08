defmodule TimeTrackerWeb.WorkingTimeJSON do
  alias TimeTracker.WorkingTimeContext.WorkingTime

  @doc """
  Renders a list of working_times.
  """
  def index(%{working_times: working_times}) do
    %{data: for(working_time <- working_times, do: data(working_time))}
  end

  @doc """
  Renders a single working_time.
  """
  def show(%{working_time: working_times}) do
    %{data: data(working_times)}
  end

  def show2(%{working_times: working_times}) do
    %{data: Enum.map(working_times, &data/1)}
  end


  defp data(%WorkingTime{} = working_time) do
    %{
      id: working_time.id,
      start: working_time.start,
      end: working_time.end
    }
  end
end
